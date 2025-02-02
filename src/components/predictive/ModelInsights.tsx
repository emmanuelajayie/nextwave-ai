import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartLine, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { analyzeTrends } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const sampleData = [
  { name: "Jan", actual: 4000, predicted: 4400 },
  { name: "Feb", actual: 3000, predicted: 3200 },
  { name: "Mar", actual: 2000, predicted: 2400 },
  { name: "Apr", actual: 2780, predicted: 2900 },
  { name: "May", actual: 1890, predicted: 2100 },
  { name: "Jun", actual: 2390, predicted: 2500 },
];

interface Insight {
  text: string;
  confidence: number;
}

export const ModelInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [trend, setTrend] = useState<string>("");
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        console.log("Fetching insights for data");
        const result = await analyzeTrends(sampleData.map(d => d.actual));
        console.log("Received insights:", result);
        
        // Calculate model accuracy
        const mape = sampleData.reduce((acc, curr) => {
          return acc + Math.abs((curr.actual - curr.predicted) / curr.actual);
        }, 0) / sampleData.length * 100;
        
        setAccuracy(100 - mape);
        setInsights(result.insights.map(text => ({
          text,
          confidence: Math.random() * 30 + 70 // Simulated confidence scores 70-100%
        })));
        setTrend(result.trend);
      } catch (error) {
        console.error("Error fetching insights:", error);
        toast.error("Failed to analyze trends. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleFeedback = (insightIndex: number, isHelpful: boolean) => {
    console.log("Feedback received:", { insightIndex, isHelpful });
    toast.success("Thank you for your feedback! This helps improve our predictions.");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ChartLine className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Insights</h2>
        {!loading && (
          <span className="ml-auto text-sm text-muted-foreground">
            Model Accuracy: {accuracy.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#8884d8" 
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#82ca9d" 
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Key Findings</h3>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ul className="space-y-4">
                {insights.map((insight, index) => (
                  <li key={index} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm text-gray-600">{insight.text}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {insight.confidence.toFixed(1)}% confidence
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(index, true)}
                        className="h-6 px-2"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(index, false)}
                        className="h-6 px-2"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Not Helpful
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Trend Analysis</h3>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="font-medium">Current Trend: {trend}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Optimize pricing strategy based on predictions</li>
                  <li>Monitor market conditions for potential shifts</li>
                  <li>Adjust inventory levels according to forecast</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};