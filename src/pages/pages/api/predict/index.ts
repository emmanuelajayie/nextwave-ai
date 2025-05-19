// File: pages/api/predict/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { trainAndPredict } from '@/ai/PredictiveModelAI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { csvData, targetColumn } = req.body;

    if (!csvData || !targetColumn) {
      return res.status(400).json({ error: 'Missing required fields: csvData and targetColumn.' });
    }

    const result = await trainAndPredict(csvData, targetColumn);
    return res.status(200).json({ prediction: result });
  } catch (error: any) {
    console.error('Prediction error:', error);
    return res.status(500).json({ error: 'Prediction failed.', details: error.message });
  }
}
