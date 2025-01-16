import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CRM_CONFIGS = {
  hubspot: {
    name: "HubSpot",
    authUrl: "https://app.hubspot.com/oauth/authorize",
    clientId: import.meta.env.VITE_HUBSPOT_CLIENT_ID || "",
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
  },
  zoho: {
    name: "Zoho",
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    clientId: import.meta.env.VITE_ZOHO_CLIENT_ID || "",
    scopes: ["ZohoCRM.modules.ALL", "ZohoCRM.settings.ALL"],
  },
  salesforce: {
    name: "Salesforce",
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    clientId: import.meta.env.VITE_SALESFORCE_CLIENT_ID || "",
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
      toast.error(`${config.name} client ID not configured. Please check your environment variables.`);
      return;
    }

    try {
      // Generate state parameter for security
      const state = crypto.randomUUID();
      
      // Store state in localStorage for verification
      localStorage.setItem("crm_oauth_state", state);
      localStorage.setItem("crm_type", crmType);

      // Construct redirect URI - use window.location.origin to handle different environments
      const redirectUri = `${window.location.origin}/api/crm/oauth/callback`;
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