import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CRM_CONFIGS = {
  hubspot: {
    name: "HubSpot",
    authUrl: "https://app.hubspot.com/oauth/authorize",
    clientId: process.env.HUBSPOT_CLIENT_ID || "",
  },
  zoho: {
    name: "Zoho",
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    clientId: process.env.ZOHO_CLIENT_ID || "",
  },
  salesforce: {
    name: "Salesforce",
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    clientId: process.env.SALESFORCE_CLIENT_ID || "",
  },
};

export const CRMOAuthButtons = () => {
  const handleOAuthConnect = async (crmType: keyof typeof CRM_CONFIGS) => {
    const config = CRM_CONFIGS[crmType];
    console.log(`Initiating ${config.name} OAuth flow`);

    if (!config.clientId) {
      toast.error(`${config.name} client ID not configured`);
      return;
    }

    // Generate state parameter for security
    const state = crypto.randomUUID();
    
    // Store state in localStorage for verification
    localStorage.setItem("crm_oauth_state", state);

    // Construct redirect URI
    const redirectUri = `${window.location.origin}/api/crm/oauth/callback`;

    // Construct authorization URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
      scope: "read write",
    });

    // Redirect to authorization URL
    window.location.href = `${config.authUrl}?${params.toString()}`;
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
        >
          Connect Salesforce
        </Button>
      </div>
    </div>
  );
};