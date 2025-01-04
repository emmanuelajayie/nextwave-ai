import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Undo2 } from "lucide-react";

export const CleaningActions = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium">Ready to Apply Changes?</h3>
          <p className="text-sm text-muted-foreground">
            Review the changes above before applying them to your dataset
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => console.log("Revert changes")}>
            <Undo2 className="mr-2 h-4 w-4" />
            Revert
          </Button>
          <Button onClick={() => console.log("Apply changes")}>
            <Check className="mr-2 h-4 w-4" />
            Apply Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};