import neo4j from "neo4j-driver";

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

// lib/neo4j.js
export async function read(cypher: any, params = {}) {
  // 1. Open a session
  const session = driver.session();

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());

    return values;
  } finally {
    // 4. Close the session
    await session.close();
  }
}

export async function write(cypher: any, params = {}) {
  // 1. Open a session
  const session = driver.session();

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeWrite((tx) => tx.run(cypher, params));

    // 3. Process the Results
    const values = res.records.map((record) => record.toObject());

    return values;
  } finally {
    // 4. Close the session
    await session.close();
  }
}
