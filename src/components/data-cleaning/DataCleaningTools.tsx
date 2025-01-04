import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  const handleAutoClean = () => {
    console.log("Auto cleaning started");
    // Simulate cleaning process
    setTimeout(onCleaningComplete, 2000);
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Cleaning Tools</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Auto-Clean Progress</h3>
          <Progress value={66} className="h-2" />
          <p className="text-sm text-muted-foreground">66% complete</p>
        </div>

        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={handleAutoClean}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Auto-Clean Data
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Copy className="mr-2 h-4 w-4" />
            Remove Duplicates
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Fix Formatting
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Handle Missing Values
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Cleaning Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-green-500">
              <Check className="mr-2 h-4 w-4" />
              Duplicates removed
            </div>
            <div className="flex items-center text-yellow-500">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Missing values detected
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};