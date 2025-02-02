import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CRMOAuthButtons } from "./crm/CRMOAuthButtons";

export const CRMIntegration = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">CRM Integration</h2>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Connect your CRM to automatically sync customer data. We support major CRM platforms
          and custom webhook integrations.
        </AlertDescription>
      </Alert>
      
      <CRMOAuthButtons />
    </Card>
  );
};