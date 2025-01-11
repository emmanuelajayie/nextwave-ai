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
import { generatePrediction } from "@/lib/ai";

export const ModelBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [modelType, setModelType] = useState<"regression" | "classification" | "clustering">("regression");
  const [target, setTarget] = useState<string>("");

  const handleGenerateModel = async () => {
    if (!selectedSource || !modelType) {
      toast.error("Please select all required fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Generating model with:", { selectedSource, modelType, target });
      const result = await generatePrediction({
        data: [1, 2, 3, 4, 5], // Replace with actual data from selected source
        modelType,
        target,
      });
      
      console.log("Model generation result:", result);
      toast.success("Model generated successfully");
    } catch (error) {
      console.error("Error generating model:", error);
    } finally {
      setLoading(false);
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
            <label className="text-sm font-medium mb-2 block">Data Source</label>
            <Select onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales_data">Sales Data 2024</SelectItem>
                <SelectItem value="customer_data">Customer Analysis</SelectItem>
                <SelectItem value="marketing_data">Marketing Metrics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Model Type</label>
            <Select onValueChange={(value: "regression" | "classification" | "clustering") => setModelType(value)}>
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
            <Select onValueChange={setTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select target variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Prediction</SelectItem>
                <SelectItem value="churn">Customer Churn</SelectItem>
                <SelectItem value="revenue">Revenue Forecast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleGenerateModel}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Model'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};