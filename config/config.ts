// config/config.ts
interface Neo4jConfig {
  uri: string;
  username: string;
  password: string;
}

const neo4jConfig: Neo4jConfig = {
  uri: process.env.NEO4J_URI!,
  username: process.env.NEO4J_USERNAME!,
  password: process.env.NEO4J_PASSWORD!,
};

export default neo4jConfig;
