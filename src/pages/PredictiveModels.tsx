import { ModelBuilder } from "@/components/predictive/ModelBuilder";
import { ModelPerformance } from "@/components/predictive/ModelPerformance";
import { ModelTuning } from "@/components/predictive/ModelTuning";
import { ModelInsights } from "@/components/predictive/ModelInsights";
import { ModelDeployment } from "@/components/predictive/ModelDeployment";
import { ScheduledTasks } from "@/components/automation/ScheduledTasks";

const PredictiveModels = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Predictive Models</h1>
      </div>
      <div className="grid gap-6">
        <ModelBuilder />
        <div className="grid md:grid-cols-2 gap-6">
          <ModelPerformance />
          <ModelTuning />
        </div>
        <ModelInsights />
        <ScheduledTasks />
        <ModelDeployment />
      </div>
    </div>
  );
};

export default PredictiveModels;