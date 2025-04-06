
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileItem } from "./types";
import { CreateFolderForm } from "./folder-actions/CreateFolderForm";
import { FileUploader } from "./file-actions/FileUploader";
import { FileListTable } from "./file-list/FileListTable";

export const FileStorage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    try {
      console.log('Loading files from path:', currentPath);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("file_storage")
        .select("*")
        .eq("folder_path", currentPath)
        .order("is_folder", { ascending: false })
        .order("file_name");

      if (error) {
        console.error("Error loading files:", error);
        toast.error("Failed to load files");
        return;
      }

      console.log('Files loaded:', data?.length || 0, 'files');
      setFiles(data || []);
    } catch (error) {
      console.error("Error in loadFiles:", error);
      toast.error("Failed to load files");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToFolder = (folderPath: string) => {
    console.log('Navigating to folder:', folderPath);
    setCurrentPath(folderPath);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">File Storage</h2>
          <p className="text-sm text-muted-foreground">
            Current path: {currentPath}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setIsCreatingFolder(!isCreatingFolder)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <FileUploader 
            currentPath={currentPath} 
            onFileUploaded={loadFiles} 
          />
        </div>
      </div>

      {isCreatingFolder && (
        <CreateFolderForm
          currentPath={currentPath}
          onFolderCreated={loadFiles}
        />
      )}

      <FileListTable
        files={files}
        currentPath={currentPath}
        navigateToFolder={navigateToFolder}
        onActionComplete={loadFiles}
      />
    </Card>
  );
};
