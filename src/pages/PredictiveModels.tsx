
import { ModelBuilder } from "@/components/predictive/ModelBuilder";
import { ModelTraining } from "@/components/predictive/ModelTraining";
import { ModelPerformance } from "@/components/predictive/ModelPerformance";
import { ModelTuning } from "@/components/predictive/ModelTuning";
import { ModelInsights } from "@/components/predictive/ModelInsights";
import { ModelDeployment } from "@/components/predictive/ModelDeployment";
import { ScheduledTasks } from "@/components/automation/ScheduledTasks";
import { IndustryInsights } from "@/components/industries/IndustryInsights";
import { useEffect } from "react";

const PredictiveModels = () => {
  useEffect(() => {
    // Log when the component mounts to verify it's being rendered
    console.log("PredictiveModels page mounted");
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Predictive Models</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <ModelBuilder />
          <ModelTraining />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <ModelPerformance />
          <ModelTuning />
        </div>
        <ModelInsights />
        <IndustryInsights />
        <ScheduledTasks />
        <ModelDeployment />
      </div>
    </div>
  );
};

export default PredictiveModels;
