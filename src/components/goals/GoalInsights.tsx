import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface Insight {
  type: "success" | "warning" | "info";
  message: string;
}

interface GoalInsightsProps {
  insights: Insight[];
}

export const GoalInsights = ({ insights }: GoalInsightsProps) => {
  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Brain className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 rounded-lg bg-background border"
          >
            {getIcon(insight.type)}
            <p className="text-sm">{insight.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};