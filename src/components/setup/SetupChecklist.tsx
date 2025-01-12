import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface Step {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

export const SetupChecklist = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "data",
      title: "Data Collection",
      description: "Import or connect your data sources",
      route: "/data",
      completed: false,
    },
    {
      id: "cleaning",
      title: "Data Cleaning",
      description: "Clean and prepare your data",
      route: "/data-cleaning",
      completed: false,
    },
    {
      id: "models",
      title: "Predictive Models",
      description: "Create and train your models",
      route: "/predictive-models",
      completed: false,
    },
    {
      id: "dashboards",
      title: "Dashboards",
      description: "Set up your visualization dashboards",
      route: "/dashboards",
      completed: false,
    },
  ]);

  const handleStepClick = (route: string, index: number) => {
    navigate(route);
    // Mark previous steps as completed when moving forward
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => ({
        ...step,
        completed: i < index ? true : step.completed,
      }))
    );
    toast.success("You can always come back to complete skipped steps later");
  };

  const markStepComplete = (index: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: true } : step
      )
    );
    toast.success("Step marked as complete!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Setup Progress</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => markStepComplete(index)}
                disabled={step.completed}
              >
                {step.completed ? "Completed" : "Mark Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStepClick(step.route, index)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};