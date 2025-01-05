import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Save } from "lucide-react";
import { toast } from "sonner";

export const ModelDeployment = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Rocket className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Deployment</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => {
            console.log("Saving model...");
            toast.success("Model saved successfully");
          }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Model
        </Button>
        
        <Button
          className="flex-1"
          onClick={() => {
            console.log("Deploying model...");
            toast.success("Model deployed successfully");
          }}
        >
          <Rocket className="h-4 w-4 mr-2" />
          Deploy Model
        </Button>
      </div>
    </Card>
  );
};