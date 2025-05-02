
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HelpCircle, Info } from "lucide-react";
import { WebhookForm } from "./webhook/WebhookForm";
import { Separator } from "@/components/ui/separator";

export const WebhookConfig = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Configure Custom CRM Webhook</h2>
      
      <Alert className="mb-4">
        <HelpCircle className="h-4 w-4" />
        <AlertDescription>
          Use webhooks to connect your custom CRM system. Enter your webhook URL below
          and we'll automatically sync data to your system.
        </AlertDescription>
      </Alert>
      
      <Alert variant="default" className="bg-muted mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Testing Your Webhook</AlertTitle>
        <AlertDescription className="mt-2">
          <p>We'll send a test request to your webhook URL to verify it's working properly. Your webhook endpoint should:</p>
          <ul className="list-disc mt-2 ml-6 space-y-1">
            <li>Accept POST requests</li>
            <li>Handle JSON data</li>
            <li>Return a successful status code (2xx)</li>
          </ul>
          <p className="mt-2 text-sm">
            You can use services like <a href="https://webhook.site" target="_blank" rel="noreferrer" className="text-primary underline">Webhook.site</a> for testing.
          </p>
        </AlertDescription>
      </Alert>
      
      <Separator className="my-6" />
      
      <WebhookForm />
    </Card>
  );
};
