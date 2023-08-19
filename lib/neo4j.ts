import neo4jDriver from "../neo4j/connection";

export async function findShortestPath(artistId1: string, artistId2: string) {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      "MATCH p=shortestPath((start:Artist {id: $artistId1})-[*]-(end:Artist {id: $artistId2})) RETURN p",
      { artistId1, artistId2 }
    );
    return result.records.map((record) => record.get("p"));
  } finally {
    await session.close();
  }
}
