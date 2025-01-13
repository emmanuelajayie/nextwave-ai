import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type CRMType = "hubspot" | "zoho" | "salesforce" | "custom";

interface CRMConfig {
  name: string;
  type: CRMType;
  apiKey?: string;
  webhookUrl?: string;
}

export const CRMIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<CRMConfig>({
    name: "",
    type: "hubspot",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("crm_integrations").insert({
        name: config.name,
        crm_type: config.type,
        api_key: config.apiKey,
        webhook_url: config.webhookUrl,
        status: "active",
      });

      if (error) throw error;

      toast.success("CRM integration configured successfully!");
      setConfig({ name: "", type: "hubspot" });
    } catch (error) {
      console.error("Error configuring CRM:", error);
      toast.error("Failed to configure CRM integration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Configure CRM Integration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Integration Name</label>
          <Input
            placeholder="My CRM Integration"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CRM Type</label>
          <Select
            value={config.type}
            onValueChange={(value: CRMType) => setConfig({ ...config, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select CRM type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hubspot">HubSpot</SelectItem>
              <SelectItem value="zoho">Zoho</SelectItem>
              <SelectItem value="salesforce">Salesforce</SelectItem>
              <SelectItem value="custom">Custom CRM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.type !== "custom" && (
          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <Input
              type="password"
              placeholder="Enter API key"
              value={config.apiKey || ""}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              required
            />
          </div>
        )}

        {config.type === "custom" && (
          <div>
            <label className="block text-sm font-medium mb-2">Webhook URL</label>
            <Input
              placeholder="https://your-crm-webhook-url.com"
              value={config.webhookUrl || ""}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
              required
            />
          </div>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Configuring..." : "Configure Integration"}
        </Button>
      </form>
    </Card>
  );
};