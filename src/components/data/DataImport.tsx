import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileSpreadsheet, Table, Upload } from "lucide-react";

export const DataImport = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Import Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
          onClick={() => console.log("Connect Google Sheets")}
        >
          <Table className="h-8 w-8" />
          <span>Connect Google Sheets</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
          onClick={() => console.log("Connect Excel")}
        >
          <FileSpreadsheet className="h-8 w-8" />
          <span>Connect Excel Online</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
          onClick={() => console.log("Upload File")}
        >
          <Upload className="h-8 w-8" />
          <span>Upload Excel File</span>
        </Button>
      </div>
    </Card>
  );
};