import { auth } from "@/lib/auth";
import { write } from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const requestedUserId = searchParams.get("id");

  if (!requestedUserId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (requestedUserId === user.id) {
    return NextResponse.json(
      { error: "You cannot accept a connection with yourself" },
      { status: 400 },
    );
  }

  try {
    const cypherDelete = `
      MATCH (requester:User {id: $requesterId})-[r:IS_REQUESTING]->(requested:User {id: $requestedUserId})
      DELETE r
      RETURN requester, requested
    `;

    await write(cypherDelete, {
      requesterId: requestedUserId,
      requestedUserId: user.id,
    });

    const cypherCreate = `
      MATCH (requester:User {id: $requesterId}), (requested:User {id: $requestedUserId})
      CREATE (requester)-[:CONNECTED_TO]->(requested)
      CREATE (requested)-[:CONNECTED_TO]->(requester)
      RETURN requester, requested
    `;

    await write(cypherCreate, {
      requesterId: requestedUserId,
      requestedUserId: user.id,
    });

    return NextResponse.json(
      { message: "Connection request accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error accepting connection request:", error);
    return NextResponse.json(
      { error: "Failed to accept connection request" },
      { status: 500 },
    );
  }
}
