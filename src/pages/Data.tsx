
import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Data = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status first
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Authentication error:", error);
          setError("Authentication error. Please try signing in again.");
          return;
        }
        
        setIsAuthenticated(!!data.session);
        
        // Only proceed if the user is authenticated
        if (!data.session) {
          console.log("User not authenticated on Data Collection page");
          setError("You must be logged in to access this page");
          return;
        }
        
        console.log("User authenticated on Data Collection page");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Error checking authentication:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // Handle OAuth callback params
    try {
      const oauthSuccess = searchParams.get("oauth_success");
      const oauthError = searchParams.get("oauth_error");
      const crmType = searchParams.get("crm_type");

      if (oauthSuccess === "true" && crmType) {
        const formattedCrmType = crmType.charAt(0).toUpperCase() + crmType.slice(1).replace('_', ' ');
        toast.success(`Successfully connected to ${formattedCrmType}`);
      } else if (oauthError) {
        toast.error(`Failed to connect: ${oauthError}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error processing OAuth response";
      console.error("OAuth callback error:", errorMessage);
      toast.error(errorMessage);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">
            Please refresh the page or try signing in again.
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to view this page.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Collection</h1>
        <p className="text-muted-foreground mb-6">
          Connect to your CRM systems, import data from various sources, and set up automated data collection.
        </p>
        <div className="grid gap-6">
          <DataImport />
          <div className="grid md:grid-cols-2 gap-6">
            <CRMIntegration />
            <CRMList />
          </div>
          <WebhookConfig />
          <DataSources />
          <DataPreview />
          <ScheduledTasks />
        </div>
      </div>
    </MainLayout>
  );
};

export default Data;
