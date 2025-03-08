
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface PredictionRequest {
  modelType: "regression" | "classification" | "clustering";
  industry: "ecommerce" | "logistics" | "finance" | "tech" | "realestate";
  dataSource: string;
  target: string;
}

export interface PredictionResponse {
  id: string;
  prediction: any[];
  confidence: number;
  insights: string[];
  created_at: string;
}

export const usePredictiveModel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Get models from the database
  const { data: models, isLoading: isLoadingModels, refetch: refetchModels } = useQuery({
    queryKey: ['predictive-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictive_models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching models:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Generate a new prediction
  const generatePrediction = async (params: PredictionRequest): Promise<PredictionResponse> => {
    try {
      setIsGenerating(true);
      
      // First create a pending model record
      const { data: pendingModel, error: pendingError } = await supabase
        .from('predictive_models')
        .insert({
          name: `${params.industry} ${params.modelType} model`,
          model_type: params.modelType,
          industry: params.industry,
          target_variable: params.target,
          data_source: params.dataSource,
          status: 'training',
          training_progress: 0
        })
        .select()
        .single();
      
      if (pendingError) throw pendingError;
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 10;
          if (next >= 90) clearInterval(progressInterval);
          return Math.min(next, 90);
        });
      }, 1000);

      // Get session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Authentication required");
      }
      
      // Call the predict edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(params)
        }
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate prediction");
      }
      
      const result = await response.json();
      
      // Refetch the models to get the updated list
      refetchModels();
      
      return result;
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast.error("Failed to generate prediction: " + error.message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Update an existing model
  const { mutate: updateModel } = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string, [key: string]: any }) => {
      const { data, error } = await supabase
        .from('predictive_models')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchModels();
      toast.success("Model updated successfully");
    },
    onError: (error) => {
      console.error("Error updating model:", error);
      toast.error("Failed to update model");
    }
  });

  return {
    models,
    isLoadingModels,
    isGenerating,
    progress,
    generatePrediction,
    updateModel
  };
};
