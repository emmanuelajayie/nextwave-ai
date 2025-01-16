import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import { SetupChecklist } from "@/components/setup/SetupChecklist";
import { ModelTraining } from "@/components/predictive/ModelTraining";
import { DataCleaningPreferences } from "@/components/setup/DataCleaningPreferences";
import { TeamManagement } from "@/components/collaboration/TeamManagement";
import { ExportOptions } from "@/components/exports/ExportOptions";
import { ScheduledTasks } from "@/components/automation/ScheduledTasks";
import { FileStorage } from "@/components/storage/FileStorage";
import { PricingSection } from "@/components/pricing/PricingSection";

const Index = () => {
  console.log("Rendering Index page");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <PricingSection />
        <FileStorage />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamManagement />
          <ExportOptions />
        </div>
        <SetupChecklist />
        <DataCleaningPreferences />
        <MetricsGrid />
        <ModelTraining />
        <GoalsOverview />
        <InsightsSection />
        <ScheduledTasks />
      </div>
    </MainLayout>
  );
};

export default Index;