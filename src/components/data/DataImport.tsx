
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileSpreadsheet, Table, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ErrorLogger from "@/utils/errorLogger";

export const DataImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleConnectGoogleSheets = async () => {
    setIsConnecting("google");
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate the connection with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Record the connection in Supabase
      if (user) {
        const { error } = await supabase
          .from("data_sources")
          .insert({
            user_id: user.id,
            name: "Google Sheets Data",
            type: "google_sheets",
            status: "Connected",
            last_sync: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      toast.success("Successfully connected to Google Sheets");
      
      // Notify that a data source was updated
      window.dispatchEvent(new CustomEvent("data-source-updated"));
    } catch (error) {
      console.error("Error connecting to Google Sheets:", error);
      toast.error("Failed to connect to Google Sheets");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to connect to Google Sheets"));
    } finally {
      setIsConnecting(null);
    }
  };

  const handleConnectExcel = async () => {
    setIsConnecting("excel");
    try {
      // In a real implementation, this would redirect to Microsoft OAuth
      // For now, we'll simulate the connection with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Record the connection in Supabase
      if (user) {
        const { error } = await supabase
          .from("data_sources")
          .insert({
            user_id: user.id,
            name: "Excel Online Data",
            type: "excel_online",
            status: "Connected",
            last_sync: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      toast.success("Successfully connected to Excel Online");
      
      // Notify that a data source was updated
      window.dispatchEvent(new CustomEvent("data-source-updated"));
    } catch (error) {
      console.error("Error connecting to Excel Online:", error);
      toast.error("Failed to connect to Excel Online");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to connect to Excel Online"));
    } finally {
      setIsConnecting(null);
    }
  };

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload the file to Supabase storage
      if (user) {
        const fileName = `excel_uploads/${user.id}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("user_files")
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Record the file upload in the database
        const { error: fileStorageError } = await supabase
          .from("file_storage")
          .insert({
            file_name: file.name,
            file_path: fileName,
            folder_path: "/excel_uploads/",
            size: file.size,
            mime_type: file.type,
            is_folder: false
          });
          
        if (fileStorageError) throw fileStorageError;
        
        const { error: dataSourceError } = await supabase
          .from("data_sources")
          .insert({
            user_id: user.id,
            name: file.name,
            type: "excel_file",
            status: "Syncing",
            last_sync: new Date().toISOString()
          });
          
        if (dataSourceError) throw dataSourceError;
      }
      
      toast.success("File uploaded successfully");
      
      // Refresh the DataSources component after upload
      window.dispatchEvent(new CustomEvent("data-source-updated"));
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to upload file"));
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Import Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
          onClick={handleConnectGoogleSheets}
          disabled={isConnecting === "google"}
        >
          <Table className="h-8 w-8" />
          <span>{isConnecting === "google" ? "Connecting..." : "Connect Google Sheets"}</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
          onClick={handleConnectExcel}
          disabled={isConnecting === "excel"}
        >
          <FileSpreadsheet className="h-8 w-8" />
          <span>{isConnecting === "excel" ? "Connecting..." : "Connect Excel Online"}</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center gap-2"
          disabled={isUploading}
          asChild
        >
          <label>
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleUploadFile}
              disabled={isUploading}
            />
            <Upload className="h-8 w-8" />
            <span>{isUploading ? "Uploading..." : "Upload Excel File"}</span>
          </label>
        </Button>
      </div>
    </Card>
  );
};
