
import MainLayout from "@/components/layout/MainLayout";
import { ModelBuilder } from "@/components/predictive/ModelBuilder";
import { ModelTraining } from "@/components/predictive/ModelTraining";
import { ModelInsights } from "@/components/predictive/ModelInsights";
import { ModelPerformance } from "@/components/predictive/ModelPerformance";
import { ModelTuning } from "@/components/predictive/ModelTuning";
import { ModelDeployment } from "@/components/predictive/ModelDeployment";
import { AutomationSettings } from "@/components/automation/AutomationSettings";

const PredictiveModels = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Predictive Models</h1>
        <p className="text-muted-foreground mb-6">
          Build predictive models based on your cleaned data to forecast trends and outcomes.
        </p>
        <AutomationSettings />
        <div className="grid gap-6">
          <ModelTraining />
          <div className="grid lg:grid-cols-2 gap-6">
            <ModelBuilder />
            <ModelTuning />
          </div>
          <ModelPerformance />
          <ModelInsights />
          <ModelDeployment />
        </div>
      </div>
    </MainLayout>
  );
};

export default PredictiveModels;
