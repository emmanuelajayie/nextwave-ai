import { Card } from "@/components/ui/card";
import { WebhookForm } from "./webhook/WebhookForm";

export const WebhookConfig = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Configure Custom CRM Webhook</h2>
      <WebhookForm />
    </Card>
  );
};