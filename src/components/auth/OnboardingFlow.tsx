import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataImport } from "@/components/data/DataImport";
import { AutomationSettings } from "@/components/automation/AutomationSettings";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  {
    title: "Connect Data Sources",
    description: "Connect your data sources to get started",
    component: DataImport,
  },
  {
    title: "Setup Automation",
    description: "Configure your automation preferences",
    component: AutomationSettings,
  },
  {
    title: "Quick Tutorial",
    description: "Learn how to use key features",
    content: (
      <div className="space-y-4">
        <h3 className="font-semibold">Welcome to the Dashboard!</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            View your data insights on the main dashboard
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Configure automation settings in the settings panel
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Monitor updates and optimizations in real-time
          </li>
        </ul>
      </div>
    ),
  },
];

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="py-4">
          {CurrentStepComponent ? (
            <CurrentStepComponent />
          ) : (
            steps[currentStep].content
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};