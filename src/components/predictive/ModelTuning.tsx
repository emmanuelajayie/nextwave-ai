import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { toast } from "sonner";

export const ModelTuning = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Tuning</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Learning Rate</label>
          <Input 
            type="number" 
            placeholder="0.001"
            step="0.001"
            min="0"
            max="1"
            onChange={(e) => console.log("Learning rate:", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Epochs</label>
          <Input 
            type="number" 
            placeholder="100"
            min="1"
            onChange={(e) => console.log("Epochs:", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Batch Size</label>
          <Input 
            type="number" 
            placeholder="32"
            min="1"
            onChange={(e) => console.log("Batch size:", e.target.value)}
          />
        </div>

        <Button 
          className="w-full"
          onClick={() => {
            console.log("Updating model parameters...");
            toast.success("Model parameters updated");
          }}
        >
          Update Parameters
        </Button>
      </div>
    </Card>
  );
};