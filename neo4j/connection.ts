import neo4j, { Driver } from "neo4j-driver";
import neo4jConfig from "../config/config";

const neo4jDriver: Driver = neo4j.driver(
  neo4jConfig.uri,
  neo4j.auth.basic(neo4jConfig.username, neo4jConfig.password)
);

export default neo4jDriver;
