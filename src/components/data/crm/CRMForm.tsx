
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crmSchema, type CRMFormData } from "./crm-schema";
import { useCRMForm } from "./use-crm-form";

export const CRMForm = () => {
  const { isLoading, onSubmit } = useCRMForm();
  const form = useForm<CRMFormData>({
    resolver: zodResolver(crmSchema),
    defaultValues: {
      name: "",
      type: "hubspot",
    },
  });

  const handleSubmit = async (data: CRMFormData) => {
    const success = await onSubmit(data);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Integration Name</FormLabel>
              <FormControl>
                <Input placeholder="My CRM Integration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CRM Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CRM type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hubspot">HubSpot</SelectItem>
                  <SelectItem value="zoho">Zoho</SelectItem>
                  <SelectItem value="salesforce">Salesforce</SelectItem>
                  <SelectItem value="custom">Custom CRM</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") !== "custom" && (
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter API key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("type") === "custom" && (
          <FormField
            control={form.control}
            name="webhookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-crm-webhook-url.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Configuring..." : "Configure Integration"}
        </Button>
      </form>
    </Form>
  );
};
