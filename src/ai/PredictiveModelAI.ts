// src/ai/PredictiveModelAI.ts

import * as tf from '@tensorflow/tfjs';

interface PredictionInput {
  data: number[][];
  labels: number[];
  epochs?: number;
}

export async function trainAndPredict({ data, labels, epochs = 50 }: PredictionInput) {
  const model = tf.sequential();

  model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [data[0].length] }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  const xs = tf.tensor2d(data);
  const ys = tf.tensor1d(labels);

  await model.fit(xs, ys, { epochs });

  const predictions = model.predict(xs) as tf.Tensor;
  const result = await predictions.array();

  return result;
}
