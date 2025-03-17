
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
import { BusinessTypeSelect } from "@/components/onboarding/BusinessTypeSelect";
import { SubscriptionAlert } from "@/components/subscription/SubscriptionAlert";
import { DataImport } from "@/components/data/DataImport";
import { DataSources } from "@/components/data/DataSources";
import { HealthStatus } from "@/components/data/HealthStatus";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && !error.message.includes("JSON object requested, multiple (or no) rows returned")) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error("Error fetching payment data:", error);
        return null;
      }
    },
  });

  return (
    <MainLayout>
      {!payments && <BusinessTypeSelect />}
      <div className="space-y-6">
        <SubscriptionAlert />
        <DashboardHeader />
        <HealthStatus />
        <FileStorage />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamManagement />
          <ExportOptions />
        </div>
        <div className="space-y-6">
          <DataImport />
          <DataSources />
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
