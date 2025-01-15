import { Card } from "@/components/ui/card";
import { CRMOAuthButtons } from "./crm/CRMOAuthButtons";

export const CRMIntegration = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">CRM Integration</h2>
      <CRMOAuthButtons />
    </Card>
  );
};