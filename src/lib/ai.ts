import { toast } from "sonner";

interface PredictionRequest {
  data: number[];
  modelType: "regression" | "classification" | "clustering";
  target?: string;
}

interface PredictionResponse {
  prediction: number[] | string[];
  confidence: number;
  insights: string[];
}

interface TrendAnalysisResponse {
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  insights: string[];
  forecast: number[];
}

export const generatePrediction = async (params: PredictionRequest): Promise<PredictionResponse> => {
  try {
    console.log("Generating prediction with params:", params);
    const response = await fetch("/api/ai/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to generate prediction");
    }

    const data = await response.json();
    console.log("Prediction response:", data);
    return data;
  } catch (error) {
    console.error("Error generating prediction:", error);
    toast.error("Failed to generate prediction");
    throw error;
  }
};

export const analyzeTrends = async (data: number[]): Promise<TrendAnalysisResponse> => {
  try {
    console.log("Analyzing trends with data:", data);
    const response = await fetch("/api/ai/trends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze trends");
    }

    const result = await response.json();
    console.log("Trend analysis response:", result);
    return result;
  } catch (error) {
    console.error("Error analyzing trends:", error);
    toast.error("Failed to analyze trends");
    throw error;
  }
};