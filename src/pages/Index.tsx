import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";

const Index = () => {
  return (
    <MainLayout>
      <DashboardHeader />
      <div className="space-y-6">
        <MetricsGrid />
        <GoalsOverview />
        <InsightsSection />
      </div>
    </MainLayout>
  );
};

export default Index;