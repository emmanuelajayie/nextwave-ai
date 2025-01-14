import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import { SetupChecklist } from "@/components/setup/SetupChecklist";
import { ModelTraining } from "@/components/predictive/ModelTraining";
import { DataCleaningPreferences } from "@/components/setup/DataCleaningPreferences";

const Index = () => {
  console.log("Rendering Index page");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <SetupChecklist />
        <DataCleaningPreferences />
        <MetricsGrid />
        <ModelTraining />
        <GoalsOverview />
        <InsightsSection />
      </div>
    </MainLayout>
  );
};

export default Index;