
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export type WorkflowConfig = {
  analytics?: {
    schedule?: string;
    time?: string;
  };
  reports?: {
    schedule?: string;
    time?: string;
  };
  workflow?: {
    schedule?: string;
    time?: string;
    days?: string[];
  };
  notifications?: {
    email?: boolean;
  };
};

export const useWorkflow = () => {
  const [lastError, setLastError] = useState<Error | null>(null);

  // Fetch workflows
  const { data: workflows, isLoading, refetch, error } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      console.log('Fetching workflows...');
      try {
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          setLastError(new Error(error.message));
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching workflows:', error);
        setLastError(error instanceof Error ? error : new Error('Failed to load workflows'));
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on policy errors
      if (error instanceof Error && 
          (error.message.includes("recursion") || error.message.includes("permission"))) {
        return false;
      }
      return failureCount < 1;
    }
  });

  // Update workflow configuration
  const { mutate: updateWorkflow, isPending } = useMutation({
    mutationFn: async (config: WorkflowConfig) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (workflows && workflows.length > 0) {
        // Update existing workflow
        const { data, error } = await supabase
          .from('workflows')
          .update({
            config,
            updated_at: new Date().toISOString()
          })
          .eq('id', workflows[0].id)
          .select();

        if (error) {
          throw error;
        }

        return data;
      } else {
        // Create new workflow
        const { data, error } = await supabase
          .from('workflows')
          .insert({
            name: 'Scheduled Tasks',
            config,
            status: 'active',
            created_by: user.id
          })
          .select();

        if (error) {
          throw error;
        }

        return data;
      }
    },
    onSuccess: () => {
      toast.success('Workflow settings saved');
      refetch();
    },
    onError: (error) => {
      console.error('Error updating workflow:', error);
      setLastError(error instanceof Error ? error : new Error('Failed to update workflow'));
      toast.error('Failed to save workflow settings');
    }
  });

  return {
    workflows,
    isLoading,
    updateWorkflow,
    isPending,
    error: lastError || error
  };
};
