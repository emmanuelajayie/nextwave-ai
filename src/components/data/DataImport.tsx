
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileSpreadsheet, Table, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ErrorLogger from "@/utils/errorLogger";
import { BackendService } from "@/lib/backend-service";

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
    try {
      setIsConnecting("google");
      console.log("Initiating Google Sheets OAuth flow");
      
      // Instead of using a function, we'll construct the OAuth URL directly
      // This is a temporary solution until the edge function is properly configured
      const redirectUri = encodeURIComponent(`${window.location.origin}/data?crm_type=google_sheets&oauth_success=true`);
      const googleClientId = "YOUR_GOOGLE_CLIENT_ID"; // This would normally come from env or config
      const scope = encodeURIComponent("https://www.googleapis.com/auth/spreadsheets.readonly");
      
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
      
      // For testing, we'll simply show a success toast instead of redirecting
      toast.success("Google Sheets connection initiated");
      console.log("Would navigate to:", googleOAuthUrl);
      
      // Uncomment this to actually redirect when client ID is available
      // window.location.href = googleOAuthUrl;
    } catch (error) {
      console.error("Error connecting to Google Sheets:", error);
      toast.error("Failed to connect to Google Sheets");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to connect to Google Sheets"));
    } finally {
      setIsConnecting(null);
    }
  };

  const handleConnectExcel = async () => {
    try {
      setIsConnecting("excel");
      console.log("Initiating Excel Online OAuth flow");
      
      // Similar approach to Google Sheets
      const redirectUri = encodeURIComponent(`${window.location.origin}/data?crm_type=excel_online&oauth_success=true`);
      
      // For testing, we'll simply show a success toast
      toast.success("Excel Online connection initiated");
      
      // Uncomment and configure when Microsoft client ID is available
      // const msClientId = "YOUR_MICROSOFT_CLIENT_ID";
      // const msOAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msClientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=Files.ReadWrite.All`;
      // window.location.href = msOAuthUrl;
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
            is_folder: false,
            user_id: user.id
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
      } else {
        throw new Error("You must be logged in to upload files");
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
