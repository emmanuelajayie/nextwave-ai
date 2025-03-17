
import { useState } from "react";
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
import { CRMIntegration } from "@/components/data/CRMIntegration";
import { CRMList } from "@/components/data/CRMList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
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
        
        <div className="rounded-lg border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="collect">1. Collect Data</TabsTrigger>
              <TabsTrigger value="clean">2. Clean Data</TabsTrigger>
              <TabsTrigger value="predict">3. Predictive Models</TabsTrigger>
              <TabsTrigger value="dashboard">4. Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="p-4 space-y-6">
              <p className="text-muted-foreground">
                Welcome to your business intelligence platform. Follow the workflow tabs above to:
                <br />1. Collect data from your CRM systems
                <br />2. Clean and prepare your data 
                <br />3. Create predictive models
                <br />4. Visualize insights on your dashboard
              </p>
              <SetupChecklist />
              <FileStorage />
              <TeamManagement />
            </TabsContent>
            
            <TabsContent value="collect" className="p-4 space-y-6">
              <h2 className="text-lg font-semibold mb-2">Step 1: Data Collection</h2>
              <ScheduledTasks />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CRMIntegration />
                <CRMList />
              </div>
              <DataImport />
              <DataSources />
            </TabsContent>
            
            <TabsContent value="clean" className="p-4 space-y-6">
              <h2 className="text-lg font-semibold mb-2">Step 2: Data Cleaning</h2>
              <DataCleaningPreferences />
              {/* We would need a data preview/cleaning interface here */}
              <p className="text-muted-foreground">
                Your data is being scanned for inconsistencies and missing values. 
                Configure your cleaning preferences above.
              </p>
            </TabsContent>
            
            <TabsContent value="predict" className="p-4 space-y-6">
              <h2 className="text-lg font-semibold mb-2">Step 3: Predictive Models</h2>
              <ModelTraining />
              <p className="text-muted-foreground">
                Build predictive models based on your cleaned data to forecast trends and outcomes.
              </p>
            </TabsContent>
            
            <TabsContent value="dashboard" className="p-4 space-y-6">
              <h2 className="text-lg font-semibold mb-2">Step 4: Interactive Dashboard</h2>
              <MetricsGrid />
              <GoalsOverview />
              <InsightsSection />
              <ExportOptions />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
