import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import { AutomationSettings } from "@/components/automation/AutomationSettings";
import { UpdateScheduler } from "@/components/automation/UpdateScheduler";
import { OptimizationAlerts } from "@/components/automation/OptimizationAlerts";
import InsightsSection from "@/components/dashboard/InsightsSection";

const Index = () => {
  return (
    <MainLayout>
      <DashboardHeader />
      <div className="space-y-6">
        <MetricsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AutomationSettings />
          <UpdateScheduler />
        </div>
        <OptimizationAlerts />
        <InsightsSection />
      </div>
    </MainLayout>
  );
};

export default Index;