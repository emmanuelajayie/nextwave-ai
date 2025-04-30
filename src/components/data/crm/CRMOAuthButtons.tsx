
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BackendService from "@/lib/backend-service";

// Define CRM configurations
const CRM_CONFIGS = {
  hubspot: {
    name: "HubSpot",
    authUrl: "https://app.hubspot.com/oauth/authorize",
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
  },
  zoho: {
    name: "Zoho",
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    scopes: ["ZohoCRM.modules.ALL", "ZohoCRM.settings.ALL"],
  },
  salesforce: {
    name: "Salesforce",
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    scopes: ["api", "refresh_token"],
  },
};

export const CRMOAuthButtons = () => {
  const handleOAuthConnect = async (crmType: keyof typeof CRM_CONFIGS) => {
    const config = CRM_CONFIGS[crmType];
    console.log(`Initiating ${config.name} OAuth flow`);
    
    try {
      // Show loading toast
      toast.loading(`Connecting to ${config.name}...`);
      
      // Use our secure edge function to handle the OAuth flow
      const response = await BackendService.callFunction("crm-oauth-initialize", {
        crmType,
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Redirect to authorization URL
      console.log(`Redirecting to ${config.name} authorization URL`);
      window.location.href = response.authUrl;
    } catch (error) {
      console.error(`Error initiating ${config.name} OAuth flow:`, error);
      toast.error(`Failed to connect to ${config.name}. Please try again.`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Connect Your CRM</h2>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => handleOAuthConnect("hubspot")}
          className="w-full justify-start"
        >
          Connect HubSpot
        </Button>
        <Button
          onClick={() => handleOAuthConnect("zoho")}
          className="w-full justify-start"
        >
          Connect Zoho
        </Button>
        <Button
          onClick={() => handleOAuthConnect("salesforce")}
          className="w-full justify-start"
          disabled={true}
        >
          Connect Salesforce (Coming Soon)
        </Button>
      </div>
    </div>
  );
};
