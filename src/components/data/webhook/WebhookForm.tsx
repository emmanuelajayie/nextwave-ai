import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { webhookFormSchema, type WebhookFormValues } from "./webhook-schema";
import { useWebhookForm } from "./use-webhook-form";

export const WebhookForm = () => {
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      webhookUrl: "",
      name: "",
    },
  });

  const { isLoading, onSubmit } = useWebhookForm(form);

  return (
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
              <FormMessage />
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
                <Input
                  placeholder="https://your-webhook-url.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The URL that will receive webhook events
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Configuring..." : "Configure Webhook"}
        </Button>
      </form>
    </Form>
  );
};