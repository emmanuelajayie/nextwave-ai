
import { useState, useEffect } from "react";
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
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup function to reset progress when component unmounts
    return () => {
      setProgress(0);
      setIsGenerating(false);
    };
  }, []);

  // Get models from the database with improved error handling
  const { data: models, isLoading: isLoadingModels, refetch: refetchModels, error: modelsError } = useQuery({
    queryKey: ['predictive-models'],
    queryFn: async () => {
      console.log("Fetching predictive models");
      try {
        // First check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session, returning empty models array");
          return [];
        }
        
        const { data, error } = await supabase
          .from('predictive_models')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching models:", error);
          setLastError(error.message);
          throw error;
        }
        
        console.log("Fetched models:", data);
        return data || [];
      } catch (error) {
        console.error("Exception in queryFn:", error);
        setLastError(error instanceof Error ? error.message : "Unknown error fetching models");
        return [];
      }
    },
    // Add retry and caching options
    retry: 2,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });

  // Generate a new prediction with improved error handling
  const generatePrediction = async (params: PredictionRequest): Promise<PredictionResponse> => {
    try {
      setIsGenerating(true);
      setProgress(0);
      setLastError(null);
      console.log("Generating prediction with params:", params);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const error = new Error("Authentication required");
        console.error(error);
        toast.error(error.message);
        throw error;
      }
      
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
          training_progress: 0,
          user_id: session.user.id
        })
        .select()
        .single();
      
      if (pendingError) {
        console.error("Error creating pending model:", pendingError);
        setLastError(pendingError.message);
        throw pendingError;
      }
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 10;
          if (next >= 90) clearInterval(progressInterval);
          return Math.min(next, 90);
        });
      }, 1000);
      
      // Call the predict edge function
      console.log("Calling predict edge function");
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            ...params,
            userId: session.user.id
          })
        }
      );
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        let errorMessage = "Failed to generate prediction";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        
        console.error("Edge function error:", errorMessage);
        setLastError(errorMessage);
        setProgress(0);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log("Prediction result:", result);
      setProgress(100);
      
      // Refetch the models to get the updated list
      refetchModels();
      
      return result;
    } catch (error) {
      console.error("Error generating prediction:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      toast.error("Failed to generate prediction: " + errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Update an existing model with improved error handling
  const { mutate: updateModel, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string, [key: string]: any }) => {
      console.log("Updating model:", id, updates);
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Authentication required");
      }
      
      const { data, error } = await supabase
        .from('predictive_models')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating model:", error);
        setLastError(error.message);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      refetchModels();
      toast.success("Model updated successfully");
    },
    onError: (error) => {
      console.error("Error updating model:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setLastError(errorMessage);
      toast.error("Failed to update model: " + errorMessage);
    }
  });

  return {
    models,
    isLoadingModels,
    isGenerating,
    isUpdating,
    progress,
    generatePrediction,
    updateModel,
    lastError,
    modelsError
  };
};
