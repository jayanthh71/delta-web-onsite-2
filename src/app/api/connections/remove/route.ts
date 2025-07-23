import { auth } from "@/lib/auth";
import { write } from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const connectionId = searchParams.get("id");

  if (!connectionId) {
    return NextResponse.json(
      { error: "Connection ID is required" },
      { status: 400 },
    );
  }

  try {
    const cypher = `
      MATCH (user:User {id: $userId})-[r1:CONNECTED_TO]->(connection:User {id: $connectionId})
      MATCH (connection)-[r2:CONNECTED_TO]->(user)
      DELETE r1, r2
      RETURN user, connection
    `;

    await write(cypher, {
      userId: user.id,
      connectionId,
    });

    return NextResponse.json(
      { message: "Connection removed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing connection:", error);
    return NextResponse.json(
      { error: "Failed to remove connection" },
      { status: 500 },
    );
  }
}
