import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { CRMFormData } from "./crm-schema";

export const useCRMForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CRMFormData) => {
    setIsLoading(true);
    console.log("Submitting CRM integration:", data);

    try {
      const { error } = await supabase.from("crm_integrations").insert({
        name: data.name,
        crm_type: data.type,
        api_key: data.apiKey,
        webhook_url: data.webhookUrl,
        status: "active",
      });

      if (error) throw error;

      toast.success("CRM integration configured successfully!");
      return true;
    } catch (error) {
      console.error("Error configuring CRM:", error);
      toast.error("Failed to configure CRM integration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, onSubmit };
};