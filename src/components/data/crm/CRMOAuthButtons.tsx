
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define CRM configurations with hardcoded client IDs to avoid environment variable issues
const CRM_CONFIGS = {
  hubspot: {
    name: "HubSpot",
    authUrl: "https://app.hubspot.com/oauth/authorize",
    clientId: "b8b28cdc-3ef6-4571-b069-eb11a9f0762a", // Hard-coded client ID
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
  },
  zoho: {
    name: "Zoho",
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    clientId: "1000.WE1B5QXLMYQ53ATX6UMGKXDCQ98U6K", // Hard-coded client ID 
    scopes: ["ZohoCRM.modules.ALL", "ZohoCRM.settings.ALL"],
  },
  salesforce: {
    name: "Salesforce",
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    clientId: "3MVG9n_HvETGhr3BHNeGcl9q29fZKJ2Hbi2uzdjdM4d0IKm0L4dz_pGcCs1gQvS_N2v5A6TiBGDhRoLYgXvaN", // Hard-coded client ID
    scopes: ["api", "refresh_token"],
  },
};

export const CRMOAuthButtons = () => {
  const handleOAuthConnect = async (crmType: keyof typeof CRM_CONFIGS) => {
    const config = CRM_CONFIGS[crmType];
    console.log(`Initiating ${config.name} OAuth flow with config:`, {
      clientId: config.clientId ? "Present" : "Missing",
      authUrl: config.authUrl,
      scopes: config.scopes,
    });

    if (!config.clientId) {
      console.error(`${config.name} client ID not configured`);
      toast.error(`${config.name} client ID not configured in your environment variables.`);
      return;
    }

    try {
      // Generate state parameter for security
      const state = crypto.randomUUID();
      
      // First, create a record in crm_integrations table with pending status
      const { error: dbError } = await supabase
        .from("crm_integrations")
        .insert({
          crm_type: crmType,
          name: `${config.name} Integration`,
          status: "pending",
          oauth_data: {
            state,
            created_at: new Date().toISOString(),
            status: "pending"
          }
        });

      if (dbError) {
        console.error("Error creating integration record:", dbError);
        toast.error("Failed to initialize OAuth flow. Please try again.");
        return;
      }

      // Construct redirect URI using the new domain
      const redirectUri = `https://app.nextwaveai.solutions/api/crm/oauth/callback?crm_type=${crmType}`;
      console.log("Redirect URI:", redirectUri);

      // Construct authorization URL with all required parameters
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        state,
        scope: config.scopes.join(" "),
      });

      const authUrl = `${config.authUrl}?${params.toString()}`;
      console.log(`Redirecting to ${config.name} authorization URL:`, authUrl);

      // Show loading toast
      toast.loading(`Connecting to ${config.name}...`);

      // Redirect to authorization URL
      window.location.href = authUrl;
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
        >
          Connect Salesforce
        </Button>
      </div>
    </div>
  );
};
