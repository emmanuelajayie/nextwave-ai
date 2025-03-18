
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import { SetupChecklist } from "@/components/setup/SetupChecklist";
import { FileStorage } from "@/components/storage/FileStorage";
import { TeamManagement } from "@/components/collaboration/TeamManagement";
import { BusinessTypeSelect } from "@/components/onboarding/BusinessTypeSelect";
import { SubscriptionAlert } from "@/components/subscription/SubscriptionAlert";
import RecentActivity from "@/components/dashboard/RecentActivity";
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

  // Only show business type selection if there are no payments at all
  const shouldShowBusinessTypeSelect = !payments;
  
  // Only show subscription alert if there's payment data but subscription is not active
  const shouldShowSubscriptionAlert = payments && payments.subscription_status !== 'active';

  return (
    <MainLayout>
      {shouldShowBusinessTypeSelect && <BusinessTypeSelect />}
      <div className="space-y-6">
        {shouldShowSubscriptionAlert && <SubscriptionAlert />}
        <DashboardHeader />
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Welcome to your business intelligence platform. Use the navigation menu to access all features:
          </p>
          <SetupChecklist />
          <MetricsGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalsOverview />
            <RecentActivity />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileStorage />
            <TeamManagement />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
