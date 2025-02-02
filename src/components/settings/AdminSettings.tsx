import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Shield } from "lucide-react";

interface AdminSetting {
  id: string;
  key: string;
  value: any;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error("Auth error:", authError);
          return;
        }

        const { data: teamMembers, error } = await supabase
          .from('team_members')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error("Error checking admin status:", error);
          return;
        }

        setIsAdmin(!!teamMembers);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAdminStatus();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*");

      if (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load admin settings");
        return;
      }

      setSettings(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while loading settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from("admin_settings")
        .update({ value })
        .eq("key", key);

      if (error) {
        console.error("Error updating setting:", error);
        toast.error("Failed to update setting");
        return;
      }

      toast.success("Setting updated successfully");
      fetchSettings();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating setting");
    }
  };

  const renderFeatureFlags = () => {
    const featureFlags = settings.find(s => s.key === "feature_flags")?.value || {};
    return Object.entries(featureFlags).map(([feature, enabled]) => (
      <div key={feature} className="flex items-center justify-between py-2">
        <div>
          <Label className="capitalize">{feature.replace(/_/g, " ")}</Label>
          <p className="text-sm text-muted-foreground">
            Toggle {feature.replace(/_/g, " ")} functionality
          </p>
        </div>
        <Switch
          checked={enabled as boolean}
          onCheckedChange={(checked) => {
            const updatedFlags = { ...featureFlags, [feature]: checked };
            updateSetting("feature_flags", updatedFlags);
          }}
        />
      </div>
    ));
  };

  const renderAppConfiguration = () => {
    const config = settings.find(s => s.key === "app_configuration")?.value || {};
    return Object.entries(config).map(([key, value]) => (
      <div key={key} className="flex items-center justify-between py-2">
        <div>
          <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
          <p className="text-sm text-muted-foreground">
            Toggle {key.replace(/_/g, " ")} state
          </p>
        </div>
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => {
            const updatedConfig = { ...config, [key]: checked };
            updateSetting("app_configuration", updatedConfig);
          }}
        />
      </div>
    ));
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Admin Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage application settings and features
          </p>
        </div>
        <Settings className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-4">Feature Management</h3>
          <div className="space-y-4">
            {renderFeatureFlags()}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-4">Application Configuration</h3>
          <div className="space-y-4">
            {renderAppConfiguration()}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={fetchSettings}>
            <Shield className="mr-2 h-4 w-4" />
            Refresh Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};