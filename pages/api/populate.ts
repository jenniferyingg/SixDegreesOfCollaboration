// pages/api/populate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { populate } from "../../neo4j/populate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await populate();
    res.status(200).json({ message: "Data populated into Neo4j" });
  } catch (error : any) {
    res.status(500).json({ error: "Error populating Neo4j" });
  }
}
