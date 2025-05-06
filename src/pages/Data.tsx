
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { DataImport } from "@/components/data/DataImport";
import { DataPreview } from "@/components/data/DataPreview";
import { DataSources } from "@/components/data/DataSources";
import { CRMIntegration } from "@/components/data/CRMIntegration";
import { CRMList } from "@/components/data/CRMList";
import { WebhookConfig } from "@/components/data/WebhookConfig";
import { ScheduledTasks } from "@/components/automation/ScheduledTasks";

const Data = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    try {
      // Handle OAuth callback params
      const oauthSuccess = searchParams.get("oauth_success");
      const oauthError = searchParams.get("oauth_error");
      const crmType = searchParams.get("crm_type");

      if (oauthSuccess === "true" && crmType) {
        toast.success(`Successfully connected to ${crmType.charAt(0).toUpperCase() + crmType.slice(1)}`);
      } else if (oauthError) {
        toast.error(`Failed to connect: ${oauthError}`);
      }
    } catch (error) {
      console.error("Error processing search params:", error);
      // Don't show an error toast here to avoid unnecessary user confusion
    }
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Collection</h1>
        <p className="text-muted-foreground mb-6">
          Connect to your CRM systems, import data from various sources, and set up automated data collection.
        </p>
        <ScheduledTasks />
        <div className="grid gap-6">
          <DataImport />
          <div className="grid md:grid-cols-2 gap-6">
            <CRMIntegration />
            <CRMList />
          </div>
          <WebhookConfig />
          <DataSources />
          <DataPreview />
        </div>
      </div>
    </MainLayout>
  );
};

export default Data;
