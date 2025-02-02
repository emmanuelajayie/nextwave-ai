import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle } from "lucide-react";
import { WebhookForm } from "./webhook/WebhookForm";

export const WebhookConfig = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Configure Custom CRM Webhook</h2>
      
      <Alert className="mb-6">
        <HelpCircle className="h-4 w-4" />
        <AlertDescription>
          Use webhooks to connect your custom CRM system. Enter your webhook URL below
          and we'll automatically sync data to your system.
        </AlertDescription>
      </Alert>
      
      <WebhookForm />
    </Card>
  );
};