import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ExportOptions = () => {
  const handleExport = async (format: string) => {
    const { data, error } = await supabase
      .from("exports")
      .insert([
        {
          resource_type: "dashboard",
          resource_id: "current-dashboard",
          format,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Export error:", error);
      toast.error("Failed to initiate export");
      return;
    }

    toast.success(`Export initiated in ${format.toUpperCase()} format`);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Export Options</h2>
          <p className="text-sm text-muted-foreground">
            Export your data in different formats
          </p>
        </div>
        <Download className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleExport("csv")}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleExport("excel")}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleExport("pdf")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
      </div>
    </Card>
  );
};