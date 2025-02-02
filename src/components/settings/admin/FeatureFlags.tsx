import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FeatureFlagsProps {
  featureFlags: Record<string, boolean>;
  onUpdateSetting: (key: string, value: any) => Promise<void>;
}

export const FeatureFlags = ({ featureFlags, onUpdateSetting }: FeatureFlagsProps) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-4">Feature Management</h3>
      <div className="space-y-4">
        {Object.entries(featureFlags).map(([feature, enabled]) => (
          <div key={feature} className="flex items-center justify-between py-2">
            <div>
              <Label className="capitalize">{feature.replace(/_/g, " ")}</Label>
              <p className="text-sm text-muted-foreground">
                Toggle {feature.replace(/_/g, " ")} functionality
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => {
                const updatedFlags = { ...featureFlags, [feature]: checked };
                onUpdateSetting("feature_flags", updatedFlags);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};