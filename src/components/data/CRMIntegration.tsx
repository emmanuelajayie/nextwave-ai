import { Card } from "@/components/ui/card";
import { CRMForm } from "./crm/CRMForm";

export const CRMIntegration = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Configure CRM Integration</h2>
      <CRMForm />
    </Card>
  );
};