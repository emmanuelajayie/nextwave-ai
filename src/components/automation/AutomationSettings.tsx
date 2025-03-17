
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RefreshCw, Database, Brain, Power, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AutomationSettings = () => {
  const [masterAutomation, setMasterAutomation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure workflow exists
  useEffect(() => {
    const createWorkflowIfNeeded = async () => {
      try {
        setError(null);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('workflows')
          .select('id')
          .eq('name', 'Automated Tasks')
          .maybeSingle();

        if (error) {
          // If it's a policy error, just capture it but don't try to create workflow
          if (error.message.includes("recursion") || error.message.includes("permission")) {
            setError(error.message);
            return;
          }
          throw error;
        }

        if (!data) {
          // Create default workflow if it doesn't exist
          const { error: insertError } = await supabase
            .from('workflows')
            .insert({
              name: 'Automated Tasks',
              status: 'inactive',
              config: {},
              created_by: user.id
            });
            
          if (insertError) throw insertError;
        }
      } catch (err) {
        console.error("Error in createWorkflowIfNeeded:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize automation settings");
      }
    };

    createWorkflowIfNeeded();
  }, []);

  // Fetch current automation status
  const { data: workflows, error: queryError } = useQuery({
    queryKey: ['automation-status'],
    queryFn: async () => {
      try {
        console.log('Fetching automation status...');
        const { data, error } = await supabase
          .from('workflows')
          .select('status')
          .eq('name', 'Automated Tasks')
          .maybeSingle();

        if (error) {
          setError(error.message);
          throw error;
        }

        const isEnabled = data?.status === 'active';
        setMasterAutomation(isEnabled);
        console.log('Current automation status:', isEnabled);
        return isEnabled;
      } catch (error) {
        console.error('Error fetching automation status:', error);
        throw error;
      }
    },
    // Don't retry on policy errors
    retry: (failureCount, error) => {
      if (error instanceof Error && 
        (error.message.includes("recursion") || error.message.includes("permission"))) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: !error // Only run query if there's no initialization error
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError instanceof Error ? queryError.message : "Failed to load automation settings");
    }
  }, [queryError]);

  // Update automation status
  const { mutate: updateAutomation, isError: mutationError } = useMutation({
    mutationFn: async (enabled: boolean) => {
      console.log('Updating automation status to:', enabled);
      const { data, error } = await supabase
        .from('workflows')
        .update({ status: enabled ? 'active' : 'inactive' })
        .eq('name', 'Automated Tasks')
        .select();

      if (error) {
        setError(error.message);
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
    if (error) {
      toast.error("Can't update: " + error);
      return;
    }
    console.log('Toggling master automation:', enabled);
    updateAutomation(enabled);
  };

  const handleFeatureToggle = (feature: string) => {
    console.log(`Toggling ${feature} automation`);
    toast.success(`${feature} automation ${masterAutomation ? "enabled" : "disabled"}`);
  };

  return (
    <Card className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
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
          disabled={!!error}
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
            disabled={!masterAutomation || !!error}
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
            disabled={!masterAutomation || !!error}
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
            disabled={!masterAutomation || !!error}
          />
        </div>
      </div>
    </Card>
  );
};
