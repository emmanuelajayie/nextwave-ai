import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartLine, Loader2 } from "lucide-react";
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

const sampleData = [
  { name: "Jan", actual: 4000, predicted: 4400 },
  { name: "Feb", actual: 3000, predicted: 3200 },
  { name: "Mar", actual: 2000, predicted: 2400 },
  { name: "Apr", actual: 2780, predicted: 2900 },
  { name: "May", actual: 1890, predicted: 2100 },
  { name: "Jun", actual: 2390, predicted: 2500 },
];

export const ModelInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [trend, setTrend] = useState<string>("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        console.log("Fetching insights for data");
        const result = await analyzeTrends(sampleData.map(d => d.actual));
        console.log("Received insights:", result);
        setInsights(result.insights);
        setTrend(result.trend);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ChartLine className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Insights</h2>
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
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
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
                  <li>Optimize pricing strategy</li>
                  <li>Monitor market conditions</li>
                  <li>Adjust inventory levels</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};