
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WorkflowConfig {
  analytics: {
    schedule: string;
    time: string;
  };
  reports: {
    schedule: string;
    time: string;
  };
  workflow: {
    schedule: string;
    time: string;
    days: string[];
  };
  notifications: {
    email: boolean;
  };
}

export const useWorkflow = () => {
  // Fetch existing workflow configuration
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      console.log('Fetching workflows...');
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      console.log('Fetched workflows:', data);
      return data;
    }
  });

  // Update workflow configuration
  const { mutate: updateWorkflow, isPending } = useMutation({
    mutationFn: async (config: WorkflowConfig) => {
      console.log('Updating workflow configuration...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User must be authenticated to update workflows");
      }

      const workflowData = {
        name: 'Automated Tasks',
        config: JSON.parse(JSON.stringify(config)), // Convert WorkflowConfig to a plain object
        status: 'active',
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('workflows')
        .upsert(workflowData)
        .select();

      if (error) {
        console.error('Error updating workflow:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Schedule settings saved successfully');
    },
    onError: (error) => {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule settings');
    },
  });

  return { workflows, isLoading, updateWorkflow, isPending };
};
