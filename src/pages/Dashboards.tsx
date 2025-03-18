
import MainLayout from "@/components/layout/MainLayout";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import InsightsSection from "@/components/dashboard/InsightsSection";
import { CustomizableWidgets } from "@/components/dashboard/CustomizableWidgets";
import { DashboardTemplates } from "@/components/dashboard/DashboardTemplates";
import QuickActions from "@/components/dashboard/QuickActions";
import { ExportOptions } from "@/components/exports/ExportOptions";

const Dashboards = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboards</h1>
        <p className="text-muted-foreground mb-6">
          Visualize your data with interactive dashboards, charts, and insights.
        </p>
        <div className="grid gap-6">
          <MetricsGrid />
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
