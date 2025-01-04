import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileSpreadsheet, Target } from "lucide-react";

const actions = [
  {
    title: "Set New Goal",
    description: "Define objectives and KPIs",
    icon: Target,
  },
  {
    title: "Import Data",
    description: "Connect spreadsheet or upload file",
    icon: FileSpreadsheet,
  },
  {
    title: "Train Model",
    description: "Create new ML prediction model",
    icon: Brain,
  },
];

const QuickActions = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-center text-center"
          >
            <action.icon className="w-6 h-6 mb-2 text-primary" />
            <span className="font-medium">{action.title}</span>
            <span className="text-xs text-gray-500 mt-1">
              {action.description}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;