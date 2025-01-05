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
import { ChartLine, Database } from "lucide-react";

export const ModelBuilder = () => {
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
            <Select onValueChange={(value) => console.log("Selected source:", value)}>
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
            <Select onValueChange={(value) => console.log("Selected type:", value)}>
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
            <Select onValueChange={(value) => console.log("Selected target:", value)}>
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
            onClick={() => {
              console.log("Generating model...");
              toast.success("Model generation started");
            }}
          >
            Generate Model
          </Button>
        </div>
      </div>
    </Card>
  );
};