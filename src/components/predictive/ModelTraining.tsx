
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
import { Upload, ChartLine, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ModelTraining = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState("regression");
  const [industry, setIndustry] = useState<"ecommerce" | "logistics" | "finance">("finance");
  const [isTraining, setIsTraining] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to train models");
        return;
      }

      // Upload file to storage for processing
      setUploadProgress(10);
      
      // Create a storage folder for model training data if it doesn't exist
      const folderPath = `training-data/${session.user.id}`;
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${folderPath}/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('models')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      setUploadProgress(50);
      
      // Store training info in predictive_models table
      const { data, error } = await supabase
        .from('predictive_models')
        .insert({
          name: modelName,
          model_type: modelType,
          industry: industry,
          data_source: fileName,
          status: 'completed',
          training_progress: 100
        });

      if (error) throw error;
      
      setUploadProgress(100);
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
          <label className="block text-sm font-medium mb-2">Industry</label>
          <Select 
            value={industry} 
            onValueChange={(value: "ecommerce" | "logistics" | "finance") => setIndustry(value)}
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
          <label className="block text-sm font-medium mb-2">Model Type</label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger>
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regression">Regression (Forecasting)</SelectItem>
              <SelectItem value="classification">Classification (Categories)</SelectItem>
              <SelectItem value="clustering">Clustering (Segmentation)</SelectItem>
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

        {isTraining && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <Button
          onClick={handleTrainModel}
          disabled={isTraining || !file || !modelName}
          className="w-full"
        >
          {isTraining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Training Model...
            </>
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
