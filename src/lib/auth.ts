import DAuth from "@/lib/dauth";
import { Neo4jAdapter } from "@auth/neo4j-adapter";
import neo4j from "neo4j-driver";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

if (
  !process.env.NEXT_PUBLIC_NEO4J_URI ||
  !process.env.NEXT_PUBLIC_NEO4J_USERNAME ||
  !process.env.NEXT_PUBLIC_NEO4J_PASSWORD
) {
  throw new Error("Missing Neo4j connection details in environment variables.");
}

const driver = neo4j.driver(
  process.env.NEXT_PUBLIC_NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEXT_PUBLIC_NEO4J_USERNAME,
    process.env.NEXT_PUBLIC_NEO4J_PASSWORD,
  ),
);

const neo4jSession = driver.session();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, DAuth],
  adapter: Neo4jAdapter(neo4jSession),
});
