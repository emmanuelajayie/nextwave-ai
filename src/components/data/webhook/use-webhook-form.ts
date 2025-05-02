
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WebhookFormValues } from "./webhook-schema";
import ErrorLogger from "@/utils/errorLogger";

export const useWebhookForm = (form: UseFormReturn<WebhookFormValues>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "failed">("idle");

  // Function to test webhook by sending a test payload
  const testWebhook = async (url: string): Promise<boolean> => {
    try {
      console.log("Testing webhook URL:", url);
      
      // Send a test request to the webhook URL
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "test",
          timestamp: new Date().toISOString(),
          message: "This is a test webhook from NextWave AI",
        }),
      });
      
      // Check if the response is successful (status code 2xx)
      if (!response.ok) {
        console.warn("Webhook test failed with status:", response.status);
        return false;
      }
      
      console.log("Webhook test successful");
      return true;
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

      // Save webhook configuration to database
      const { error } = await supabase.from("crm_integrations").insert({
        name: values.name,
        crm_type: "custom",
        webhook_url: values.webhookUrl,
        status: webhookStatus,
      });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Show different messages based on test result
      if (testResult) {
        toast.success("Custom CRM webhook configured and verified successfully");
      } else {
        toast.success(
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
