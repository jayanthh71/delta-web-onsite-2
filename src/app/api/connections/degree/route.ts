import { auth } from "@/lib/auth";
import { read } from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // First check if you are directly connected to the target user
    const directConnectionCypher = `
      MATCH (currentUser:User {id: $currentUserId})-[:CONNECTED_TO]->(targetUser:User {id: $targetUserId})
      RETURN targetUser
      LIMIT 1
    `;

    const directConnection = await read(directConnectionCypher, {
      currentUserId: user.id,
      targetUserId: userId,
    });

    // If directly connected, return degree 1
    if (directConnection.length > 0) {
      return NextResponse.json(
        {
          degree: 1,
          message: "You are directly connected to this user",
        },
        { status: 200 },
      );
    }

    // Check for mutual connections (degree 2)
    const mutualConnectionCypher = `
      MATCH (currentUser:User {id: $currentUserId})-[:CONNECTED_TO]->(mutualConnection:User)
      MATCH (targetUser:User {id: $targetUserId})-[:CONNECTED_TO]->(mutualConnection)
      RETURN DISTINCT mutualConnection
      LIMIT 1
    `;

    const mutualConnection = await read(mutualConnectionCypher, {
      currentUserId: user.id,
      targetUserId: userId,
    });

    // If mutual connections exist, return degree 2
    if (mutualConnection.length > 0) {
      return NextResponse.json(
        {
          degree: 2,
          message: "You have mutual connections with this user",
        },
        { status: 200 },
      );
    }

    // No connection found, return degree 0
    return NextResponse.json(
      {
        degree: 0,
        message: "No connection found with this user",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 },
    );
  }
}
