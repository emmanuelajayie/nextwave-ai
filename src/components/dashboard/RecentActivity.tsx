import { Card } from "@/components/ui/card";
import { Brain, FileSpreadsheet, Target } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New goal created",
    description: "Q4 Sales Prediction",
    icon: Target,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    title: "Data source connected",
    description: "Sales_2023_Q3.xlsx",
    icon: FileSpreadsheet,
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    title: "Model trained",
    description: "Customer Churn Predictor",
    icon: Brain,
    timestamp: "6 hours ago",
  },
];

const RecentActivity = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <activity.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>
            <span className="text-xs text-gray-400">{activity.timestamp}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;