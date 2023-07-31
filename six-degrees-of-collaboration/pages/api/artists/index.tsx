import type { NextApiRequest, NextApiResponse } from 'next'
// controller for /artists API

export default function handler(req : NextApiRequest, res : NextApiResponse<string[]>) {
    if (req.method === 'GET') {
        res.status(200).json(
            ['Artist One', 'Artist Two', 'Artist Three']
        );
    }
}