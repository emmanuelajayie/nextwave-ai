
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ErrorLogger from "@/utils/errorLogger";

interface FileUploaderProps {
  currentPath: string;
  onFileUploaded: () => void;
}

export const FileUploader = ({
  currentPath,
  onFileUploaded,
}: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting file upload:', file.name);
      setIsUploading(true);
      
      // Get the current session to ensure user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("You must be logged in to upload files");
        return;
      }
      
      const filePath = `${currentPath}${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("user_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("file_storage").insert({
        file_name: file.name,
        file_path: filePath,
        folder_path: currentPath,
        size: file.size,
        mime_type: file.type,
        is_folder: false,
        user_id: sessionData.session.user.id // Add user_id to satisfy RLS
      });

      if (dbError) throw dbError;

      console.log('File uploaded successfully:', file.name);
      toast.success("File uploaded successfully");
      onFileUploaded();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to upload file");
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button variant="outline" asChild disabled={isUploading}>
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <File className="w-4 h-4 mr-2" />
        )}
        {isUploading ? "Uploading..." : "Upload File"}
      </label>
    </Button>
  );
};
