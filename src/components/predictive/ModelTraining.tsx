import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, ChartLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ModelTraining = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState("regression");
  const [isTraining, setIsTraining] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTrainModel = async () => {
    if (!file || !modelName) {
      toast.error("Please provide all required information");
      return;
    }

    setIsTraining(true);
    try {
      // Here we'll just simulate model training for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store training info in lovable Auth table
      const { data, error } = await supabase
        .from('lovable Auth')
        .insert({
          full_name: modelName, // Using full_name to store model name
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Model trained successfully!");
      setFile(null);
      setModelName("");
    } catch (error) {
      console.error("Error training model:", error);
      toast.error("Failed to train model. Please try again.");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Train New Model</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <Input
            placeholder="Enter model name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Model Type</label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger>
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regression">Regression (Forecasting)</SelectItem>
              <SelectItem value="classification">Classification (Categories)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Training Data</label>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setFile(null)} disabled={!file}>
              Clear
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Upload CSV or Excel file with historical data
          </p>
        </div>

        <Button
          onClick={handleTrainModel}
          disabled={isTraining || !file || !modelName}
          className="w-full"
        >
          {isTraining ? (
            "Training Model..."
          ) : (
            <>
              <ChartLine className="w-4 h-4 mr-2" />
              Train Model
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};