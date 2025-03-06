
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChartLine, Database, Loader2 } from "lucide-react";
import { usePredictiveModel } from "@/hooks/usePredictiveModel";
import { supabase } from "@/lib/supabase";

export const ModelBuilder = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [modelType, setModelType] = useState<"regression" | "classification" | "clustering">("regression");
  const [target, setTarget] = useState<string>("");
  const [industry, setIndustry] = useState<"ecommerce" | "logistics" | "finance">("finance");
  
  const { 
    isGenerating, 
    progress, 
    generatePrediction 
  } = usePredictiveModel();

  const handleGenerateModel = async () => {
    if (!selectedSource || !modelType || !target || !industry) {
      toast.error("Please select all required fields");
      return;
    }

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to generate models");
        return;
      }

      console.log("Starting model generation with:", { selectedSource, modelType, target, industry });
      
      await generatePrediction({
        modelType,
        industry,
        dataSource: selectedSource,
        target
      });
      
      toast.success("Model generated successfully");
    } catch (error) {
      console.error("Error generating model:", error);
      toast.error("Failed to generate model. Please try again.");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ChartLine className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Builder</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Industry</label>
            <Select 
              onValueChange={(value: "ecommerce" | "logistics" | "finance") => setIndustry(value)}
              value={industry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Data Source</label>
            <Select onValueChange={setSelectedSource} value={selectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_data">Sales Data 2024</SelectItem>
                <SelectItem value="customer_data">Customer Analysis</SelectItem>
                <SelectItem value="marketing_data">Marketing Metrics</SelectItem>
                <SelectItem value="crm_data">CRM Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Model Type</label>
            <Select 
              onValueChange={(value: "regression" | "classification" | "clustering") => setModelType(value)}
              value={modelType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regression">Regression</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="clustering">Clustering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Target Variable</label>
            <Select onValueChange={setTarget} value={target}>
              <SelectTrigger>
                <SelectValue placeholder="Select target variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Prediction</SelectItem>
                <SelectItem value="churn">Customer Churn</SelectItem>
                <SelectItem value="revenue">Revenue Forecast</SelectItem>
                <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleGenerateModel}
            disabled={isGenerating || !selectedSource || !modelType || !target || !industry}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Model...
              </>
            ) : (
              'Generate Model'
            )}
          </Button>
        </div>
      </div>

      {isGenerating && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Training progress: {progress}%
          </p>
        </div>
      )}
    </Card>
  );
};
