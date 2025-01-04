import { DataCleaningTools } from "@/components/data-cleaning/DataCleaningTools";
import { DataPreview } from "@/components/data-cleaning/DataPreview";
import { CleaningActions } from "@/components/data-cleaning/CleaningActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DataCleaning() {
  const { toast } = useToast();

  const handleCleaningComplete = () => {
    toast({
      title: "Data Cleaning Complete",
      description: "Would you like to proceed to building predictive models?",
      action: (
        <button
          onClick={() => console.log("Navigate to models")}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Proceed
        </button>
      ),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Data Cleaning & Preparation</h1>
      
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Data Anomalies Detected</AlertTitle>
        <AlertDescription>
          We found 3 missing values and 2 potential duplicates in your dataset.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <DataCleaningTools onCleaningComplete={handleCleaningComplete} />
        <div className="space-y-6">
          <DataPreview />
          <CleaningActions />
        </div>
      </div>
    </div>
  );
}