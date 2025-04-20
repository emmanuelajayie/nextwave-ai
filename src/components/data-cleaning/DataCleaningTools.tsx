
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { processLargeDataset } from "@/lib/data-handling/largeDataProcessor";
import { toast } from "sonner";
import {
  Check,
  AlertTriangle,
  RefreshCw,
  Copy,
  FileText,
  Undo2,
} from "lucide-react";

interface DataCleaningToolsProps {
  onCleaningComplete: () => void;
}

export const DataCleaningTools = ({ onCleaningComplete }: DataCleaningToolsProps) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAutoClean = async (data: any[]) => {
    setIsProcessing(true);
    try {
      await processLargeDataset(
        data,
        async (chunk) => {
          console.log(`Processing chunk of ${chunk.length} records`);
          // Here we would implement the actual cleaning logic
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
        },
        {
          chunkSize: 1000,
          onProgress: (progressValue) => {
            setProgress(progressValue);
          },
        }
      );
      toast.success("Data cleaning completed successfully");
      onCleaningComplete();
    } catch (error) {
      console.error("Error cleaning data:", error);
      toast.error("Failed to clean data");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Cleaning Tools</h2>
      
      <div className="space-y-4">
        {isProcessing && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Cleaning Progress</h3>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => handleAutoClean([])} // Pass your data here
            disabled={isProcessing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Cleaning Data...' : 'Auto-Clean Data'}
          </Button>

          <Button variant="outline" className="w-full justify-start" disabled={isProcessing}>
            <Copy className="mr-2 h-4 w-4" />
            Remove Duplicates
          </Button>

          <Button variant="outline" className="w-full justify-start" disabled={isProcessing}>
            <FileText className="mr-2 h-4 w-4" />
            Fix Formatting
          </Button>

          <Button variant="outline" className="w-full justify-start" disabled={isProcessing}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Handle Missing Values
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Cleaning Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-green-500">
              <Check className="mr-2 h-4 w-4" />
              Ready to process data
            </div>
            {isProcessing && (
              <div className="flex items-center text-yellow-500">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Processing in progress
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
