import type { NextApiRequest, NextApiResponse } from 'next'
import { searchArtists } from '../../lib/spotify';
// controller for /artists API

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
    if (req.method === 'GET') {
      const { q } = req.query;
  
      if (typeof q === 'string') {
        const response = await searchArtists(q);
        res.status(200).json(response.artists.items);
      } else {
        res.status(400).json([]);
      }
    } else {
      res.status(405).json([]);
    }
  }