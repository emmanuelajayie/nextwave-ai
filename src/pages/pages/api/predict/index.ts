// File: pages/api/predict/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { trainAndPredict } from '@/ai/PredictiveModelAI';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { csvData, targetColumn } = req.body;

    if (!csvData || !targetColumn) {
      return res.status(400).json({ message: 'csvData and targetColumn are required.' });
    }

    const prediction = await trainAndPredict(csvData, targetColumn);

    res.status(200).json({ prediction });
  } catch (error: any) {
    console.error('Prediction Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
  }
}
