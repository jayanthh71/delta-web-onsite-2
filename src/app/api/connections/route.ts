import { read } from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const cypher = `
    MATCH (user:User {id: $userId})-[:CONNECTED_TO]->(connection:User)
    RETURN DISTINCT connection
    ORDER BY connection.name ASC
  `;

  const connections = await read(cypher, { userId });

  return NextResponse.json({ connections }, { status: 200 });
}
