import neo4jDriver from "../neo4j/connection";
import Artist from "../components/types/Artist";

export async function findShortestPath(artistId1: string, artistId2: string): Promise<Artist[]>{
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      "MATCH p=shortestPath((start:Artist {id: $artistId1})-[*]-(end:Artist {id: $artistId2})) RETURN p",
      { artistId1, artistId2 }
    );
    const nodesPath = result.records.map((record) => record.get("p"))[0];
    const objectsPath : Artist[] = [];
    objectsPath.push({
      name: nodesPath.start.properties.name,
      id: nodesPath.start.properties.id
    })
    for (const node of nodesPath.segments) {
      objectsPath.push({
        name: node.end.properties.name,
        id: node.end.properties.id
      })
    }
    return objectsPath;
  } finally {
    await session.close();
  }
}

export async function doesArtistExist(artistId: string): Promise<boolean> {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      'MATCH (a) WHERE a.id = $artistId RETURN COUNT(a) AS count',
      { artistId }
    );
    const count = result.records[0].get('count').toNumber();
    return count > 0;
  } finally {
    session.close();
  }
}