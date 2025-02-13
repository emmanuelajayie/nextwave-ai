
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

    // Simulated API call - replace with actual ML model API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulated response
    const response: PredictionResponse = {
      prediction: params.modelType === "regression" ? 
        [120, 145, 160, 180, 200] :
        ["high", "medium", "low", "high", "medium"],
      confidence: 0.89,
      insights: [
        "Strong correlation detected with seasonal patterns",
        "Key influencing factors identified",
        "Recommendation: Consider external variables"
      ]
    };

    console.log("Prediction response:", response);
    return response;
  } catch (error) {
    console.error("Error generating prediction:", error);
    toast.error("Failed to generate prediction");
    throw error;
  }
};

export const analyzeTrends = async (data: number[]): Promise<TrendAnalysisResponse> => {
  try {
    console.log("Analyzing trends with data:", data);
    
    // Simple trend analysis logic
    const lastValue = data[data.length - 1];
    const previousValue = data[data.length - 2];
    const trend = lastValue > previousValue ? "increasing" : 
                 lastValue < previousValue ? "decreasing" : "stable";
    
    // Calculate average change
    const changes = data.slice(1).map((val, i) => val - data[i]);
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    // Generate forecast using simple moving average
    const forecast = data.map(val => val * (1 + avgChange / 100));
    
    return {
      trend,
      confidence: 0.85,
      insights: [
        `${trend.charAt(0).toUpperCase() + trend.slice(1)} trend detected`,
        `Average change: ${avgChange.toFixed(2)}%`,
        "Consider seasonal variations in analysis"
      ],
      forecast
    };
  } catch (error) {
    console.error("Error analyzing trends:", error);
    toast.error("Failed to analyze trends");
    throw error;
  }
};
