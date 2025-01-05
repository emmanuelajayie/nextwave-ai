import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RefreshCw, Database, Brain } from "lucide-react";

export const AutomationSettings = () => {
  const handleToggle = (feature: string) => {
    console.log(`Toggling ${feature} automation`);
    toast.success(`${feature} automation ${feature === "enabled" ? "enabled" : "disabled"}`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Automation Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="data-sync">Real-time Data Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync with connected data sources
              </p>
            </div>
          </div>
          <Switch id="data-sync" onCheckedChange={() => handleToggle("Data sync")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="data-cleaning">Automated Cleaning</Label>
              <p className="text-sm text-muted-foreground">
                Clean and validate data automatically
              </p>
            </div>
          </div>
          <Switch id="data-cleaning" onCheckedChange={() => handleToggle("Data cleaning")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="model-updates">Model Updates</Label>
              <p className="text-sm text-muted-foreground">
                Retrain models with new data automatically
              </p>
            </div>
          </div>
          <Switch id="model-updates" onCheckedChange={() => handleToggle("Model updates")} />
        </div>
      </div>
    </Card>
  );
};