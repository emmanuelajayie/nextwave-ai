import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AppConfigurationProps {
  config: Record<string, boolean>;
  onUpdateSetting: (key: string, value: any) => Promise<void>;
}

export const AppConfiguration = ({ config, onUpdateSetting }: AppConfigurationProps) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-4">Application Configuration</h3>
      <div className="space-y-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div>
              <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
              <p className="text-sm text-muted-foreground">
                Toggle {key.replace(/_/g, " ")} state
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => {
                const updatedConfig = { ...config, [key]: checked };
                onUpdateSetting("app_configuration", updatedConfig);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};