
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
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export const WebhookForm = () => {
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      webhookUrl: "",
      name: "",
    },
  });

  const { isLoading, testStatus, onSubmit } = useWebhookForm(form);

  // Render status indicator based on test status
  const renderTestStatus = () => {
    switch (testStatus) {
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500 ml-2" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500 ml-2" />;
      default:
        return null;
    }
  };

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
              <div className="flex items-center">
                <FormControl>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="https://your-webhook-url.com"
                      {...field}
                    />
                  </div>
                </FormControl>
                {renderTestStatus()}
              </div>
              <FormDescription>
                The URL that will receive webhook events
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {testStatus === "testing" ? "Testing..." : "Configuring..."}
            </>
          ) : (
            "Configure Webhook"
          )}
        </Button>
      </form>
    </Form>
  );
};
