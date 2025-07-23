import { auth } from "@/lib/auth";
import { read, write } from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("for");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const cypher = `
      MATCH (requester:User)-[r:IS_REQUESTING]->(requested:User {id: $userId})
      RETURN requester, r.createdAt as requestedAt
      ORDER BY r.createdAt DESC
    `;

    const result = await read(cypher, {
      userId: userId,
    });

    return NextResponse.json(
      {
        message: "Connection requests retrieved successfully",
        requests: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting connection requests:", error);
    return NextResponse.json(
      { error: "Failed to get connection requests" },
      { status: 500 },
    );
  }
}

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
      { error: "You cannot connect with yourself" },
      { status: 400 },
    );
  }

  try {
    const cypher = `
      MATCH (requester:User {id: $requesterId})
      MATCH (requested:User {id: $requestedId})
      MERGE (requester)-[r:IS_REQUESTING]->(requested)
      ON CREATE SET r.createdAt = datetime()
      RETURN r
    `;

    const result = await write(cypher, {
      requesterId: user.id,
      requestedId: requestedUserId,
    });

    return NextResponse.json(
      { message: "Connection request sent successfully", result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating connection request:", error);
    return NextResponse.json(
      { error: "Failed to send connection request" },
      { status: 500 },
    );
  }
}
