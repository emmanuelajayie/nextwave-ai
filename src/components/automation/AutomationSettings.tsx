import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RefreshCw, Database, Brain, Power } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";

export const AutomationSettings = () => {
  const [masterAutomation, setMasterAutomation] = useState(false);

  // Ensure workflow exists
  useEffect(() => {
    const createWorkflowIfNeeded = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workflows')
        .select('id')
        .eq('name', 'Automated Tasks')
        .maybeSingle();

      if (!data && !error) {
        // Create default workflow if it doesn't exist
        await supabase
          .from('workflows')
          .insert({
            name: 'Automated Tasks',
            status: 'inactive',
            config: {},
            created_by: user.id
          });
      }
    };

    createWorkflowIfNeeded();
  }, []);

  // Fetch current automation status
  const { data: workflows } = useQuery({
    queryKey: ['automation-status'],
    queryFn: async () => {
      console.log('Fetching automation status...');
      const { data, error } = await supabase
        .from('workflows')
        .select('status')
        .eq('name', 'Automated Tasks')
        .maybeSingle();

      if (error) {
        console.error('Error fetching automation status:', error);
        throw error;
      }

      const isEnabled = data?.status === 'active';
      setMasterAutomation(isEnabled);
      console.log('Current automation status:', isEnabled);
      return isEnabled;
    }
  });

  // Update automation status
  const { mutate: updateAutomation } = useMutation({
    mutationFn: async (enabled: boolean) => {
      console.log('Updating automation status to:', enabled);
      const { data, error } = await supabase
        .from('workflows')
        .update({ status: enabled ? 'active' : 'inactive' })
        .eq('name', 'Automated Tasks')
        .select();

      if (error) {
        console.error('Error updating automation status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, enabled) => {
      setMasterAutomation(enabled);
      toast.success(`Automation ${enabled ? 'enabled' : 'disabled'}`);
    },
    onError: (error) => {
      console.error('Error toggling automation:', error);
      toast.error('Failed to update automation status');
    }
  });

  const handleMasterToggle = (enabled: boolean) => {
    console.log('Toggling master automation:', enabled);
    updateAutomation(enabled);
  };

  const handleFeatureToggle = (feature: string) => {
    console.log(`Toggling ${feature} automation`);
    toast.success(`${feature} automation ${feature === "enabled" ? "enabled" : "disabled"}`);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Power className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Label htmlFor="master-automation">Master Automation Control</Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable all automated workflows
            </p>
          </div>
        </div>
        <Switch
          id="master-automation"
          checked={masterAutomation}
          onCheckedChange={handleMasterToggle}
        />
      </div>

      <h2 className="text-lg font-semibold mb-4">Individual Features</h2>
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
          <Switch 
            id="data-sync" 
            onCheckedChange={() => handleFeatureToggle("Data sync")}
            disabled={!masterAutomation}
          />
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
          <Switch 
            id="data-cleaning" 
            onCheckedChange={() => handleFeatureToggle("Data cleaning")}
            disabled={!masterAutomation}
          />
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
          <Switch 
            id="model-updates" 
            onCheckedChange={() => handleFeatureToggle("Model updates")}
            disabled={!masterAutomation}
          />
        </div>
      </div>
    </Card>
  );
};
