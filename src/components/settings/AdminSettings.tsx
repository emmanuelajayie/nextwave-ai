import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Shield } from "lucide-react";
import { AdminCard } from "./admin/AdminCard";
import { FeatureFlags } from "./admin/FeatureFlags";
import { AppConfiguration } from "./admin/AppConfiguration";

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

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  const featureFlags = settings.find(s => s.key === "feature_flags")?.value || {};
  const appConfig = settings.find(s => s.key === "app_configuration")?.value || {};

  return (
    <AdminCard
      title="Admin Settings"
      description="Manage application settings and features"
      icon={<Settings className="h-6 w-6 text-muted-foreground" />}
    >
      <div className="space-y-6">
        <FeatureFlags
          featureFlags={featureFlags}
          onUpdateSetting={updateSetting}
        />

        <AppConfiguration
          config={appConfig}
          onUpdateSetting={updateSetting}
        />

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={fetchSettings}>
            <Shield className="mr-2 h-4 w-4" />
            Refresh Settings
          </Button>
        </div>
      </div>
    </AdminCard>
  );
};