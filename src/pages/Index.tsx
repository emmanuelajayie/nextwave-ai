import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import InsightsSection from "@/components/dashboard/InsightsSection";

const Index = () => {
  return (
    <MainLayout>
      <DashboardHeader />
      <MetricsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RecentActivity />
        <QuickActions />
      </div>
      <InsightsSection />
    </MainLayout>
  );
};

export default Index;