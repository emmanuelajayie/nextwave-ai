import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  webhookUrl: z.string().url("Please enter a valid webhook URL"),
  name: z.string().min(1, "Name is required"),
});

export const WebhookConfig = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Configure Custom CRM Webhook</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integration Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Custom CRM Integration" {...field} />
                </FormControl>
                <FormDescription>
                  A friendly name for this integration
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="webhookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-crm-webhook-url.com" {...field} />
                </FormControl>
                <FormDescription>
                  The webhook URL provided by your CRM system
                </FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Configuring..." : "Configure Webhook"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};