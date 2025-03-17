
import MainLayout from "@/components/layout/MainLayout";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import { CustomizableWidgets } from "@/components/dashboard/CustomizableWidgets";
import { DashboardTemplates } from "@/components/dashboard/DashboardTemplates";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ExportOptions } from "@/components/exports/ExportOptions";
import { HealthStatus } from "@/components/data/HealthStatus";

const Dashboards = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboards</h1>
        <HealthStatus />
        <div className="grid gap-6">
          <MetricsGrid />
          <div className="grid lg:grid-cols-2 gap-6">
            <GoalsOverview />
            <RecentActivity />
          </div>
          <InsightsSection />
          <CustomizableWidgets />
          <DashboardTemplates />
          <QuickActions />
          <ExportOptions />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboards;
