import { Card } from "@/components/ui/card";
import { Activity, Brain, FileSpreadsheet, Target } from "lucide-react";

const metrics = [
  {
    title: "Active Goals",
    value: "12",
    change: "+2",
    icon: Target,
  },
  {
    title: "Data Sources",
    value: "8",
    change: "+1",
    icon: FileSpreadsheet,
  },
  {
    title: "ML Models",
    value: "5",
    change: "+3",
    icon: Brain,
  },
  {
    title: "Weekly Activity",
    value: "85%",
    change: "+12%",
    icon: Activity,
  },
];

const MetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1 md:mt-2">{metric.value}</h3>
              <p className="text-sm text-green-500 mt-1">
                {metric.change} this week
              </p>
            </div>
            <metric.icon className="w-5 h-5 text-primary" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MetricsGrid;