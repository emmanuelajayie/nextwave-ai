import { Card } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

export const ModelPerformance = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ChartBar className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Performance</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Accuracy</div>
            <div className="text-2xl font-bold text-green-700">94.5%</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Precision</div>
            <div className="text-2xl font-bold text-blue-700">92.8%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Recall</div>
            <div className="text-2xl font-bold text-purple-700">89.3%</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">F1 Score</div>
            <div className="text-2xl font-bold text-orange-700">91.0%</div>
          </div>
        </div>
      </div>
    </Card>
  );
};