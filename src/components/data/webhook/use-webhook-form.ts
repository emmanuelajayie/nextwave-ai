import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WebhookFormValues } from "./webhook-schema";

export const useWebhookForm = (form: UseFormReturn<WebhookFormValues>) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: WebhookFormValues) => {
    setIsLoading(true);
    console.log("Configuring webhook:", values);

    try {
      const { error } = await supabase.from("crm_integrations").insert({
        name: values.name,
        crm_type: "custom",
        webhook_url: values.webhookUrl,
        status: "active",
      });

      if (error) throw error;

      toast.success("Custom CRM webhook configured successfully");
      form.reset();
    } catch (error) {
      console.error("Error configuring webhook:", error);
      toast.error("Failed to configure webhook. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, onSubmit };
};