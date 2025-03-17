
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return data;
    },
  });

  return (
    <MainLayout>
      {!payments && <BusinessTypeSelect />}
      <div className="space-y-6">
        <SubscriptionAlert />
        <DashboardHeader />
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
