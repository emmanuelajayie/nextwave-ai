
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WebhookFormValues } from "./webhook-schema";
import ErrorLogger from "@/utils/errorLogger";
import { BackendService } from "@/lib/backend-service";

export const useWebhookForm = (form: UseFormReturn<WebhookFormValues>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "failed">("idle");

  // Function to test webhook by sending a test payload via backend service
  // This avoids CORS issues that happen when trying to send directly from browser
  const testWebhook = async (url: string): Promise<boolean> => {
    try {
      console.log("Testing webhook URL:", url);
      
      // Use BackendService to test the webhook - this sends the request from the server
      // which avoids CORS issues
      const testResult = await BackendService.callFunction('test-webhook', {
        webhookUrl: url,
        testPayload: {
          event: "test",
          timestamp: new Date().toISOString(),
          message: "This is a test webhook from NextWave AI",
        }
      });
      
      console.log("Webhook test result:", testResult);
      return testResult?.success === true;
    } catch (error) {
      console.error("Error testing webhook:", error);
      // We'll still allow saving if the test fails - some webhook endpoints 
      // might not respond positively to test requests but still work for real events
      return false;
    }
  };

  const onSubmit = async (values: WebhookFormValues) => {
    setIsLoading(true);
    console.log("Configuring webhook:", values);

    try {
      // Validate the URL format before proceeding
      new URL(values.webhookUrl);
      
      // Test the webhook
      setTestStatus("testing");
      const testResult = await testWebhook(values.webhookUrl);
      setTestStatus(testResult ? "success" : "failed");
      
      // Even if test fails, we'll allow saving the webhook but with a different status
      const webhookStatus = testResult ? "active" : "pending";

      // Save webhook configuration to database - using insert that doesn't reference team_members
      const { error } = await supabase
        .from("crm_webhooks") // Use a dedicated table for webhooks
        .insert({
          name: values.name,
          webhook_url: values.webhookUrl,
          status: webhookStatus,
          created_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Show different messages based on test result
      if (testResult) {
        toast.success("Custom CRM webhook configured and verified successfully");
      } else {
        toast.warning(
          "Custom CRM webhook saved, but test delivery failed. Webhook may still work for real events."
        );
      }
      
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error configuring webhook:", error);
      
      // Log detailed error information
      if (error instanceof Error) {
        ErrorLogger.logError(error, "Check that the webhook URL is correct and accessible");
      }
      
      toast.error("Failed to configure webhook. Please try again.", {
        description: errorMessage.includes("Database error") 
          ? "There was an issue saving the webhook configuration." 
          : "Please ensure the URL is valid and accessible.",
      });
      
      setTestStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, testStatus, onSubmit };
};
