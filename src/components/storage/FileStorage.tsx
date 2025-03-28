
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Folder, File, Download, Trash2, FolderPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ErrorLogger from "@/utils/errorLogger";

interface FileItem {
  id: string;
  file_name: string;
  file_path: string;
  folder_path: string;
  size?: number;
  mime_type?: string;
  is_folder: boolean;
  created_at: string;
}

export const FileStorage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isFolderProcessing, setIsFolderProcessing] = useState(false);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting file upload:', file.name);
      setIsUploading(true);
      
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
      });

      if (dbError) throw dbError;

      console.log('File uploaded successfully:', file.name);
      toast.success("File uploaded successfully");
      loadFiles();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to upload file");
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      setIsFolderProcessing(true);
      console.log('Creating folder:', newFolderName);
      
      const { data, error } = await supabase.from("file_storage").insert({
        file_name: newFolderName,
        file_path: `${currentPath}${newFolderName}/`,
        folder_path: currentPath,
        is_folder: true,
      }).select();

      if (error) {
        console.error("Error creating folder:", error);
        ErrorLogger.logError(new Error(error.message), "Failed to create folder");
        toast.error("Failed to create folder. Please try again.");
        return;
      }

      console.log('Folder created successfully:', newFolderName);
      toast.success("Folder created successfully");
      setNewFolderName("");
      setIsCreatingFolder(false);
      loadFiles();
    } catch (error: any) {
      console.error("Error creating folder:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to create folder");
      toast.error("Failed to create folder. Please try again.");
    } finally {
      setIsFolderProcessing(false);
    }
  };

  const handleDelete = async (item: FileItem) => {
    try {
      console.log('Deleting item:', item.file_name);
      
      if (!item.is_folder) {
        const { error: storageError } = await supabase.storage
          .from("user_files")
          .remove([item.file_path]);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from("file_storage")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;

      console.log('Item deleted successfully:', item.file_name);
      toast.success(
        `${item.is_folder ? "Folder" : "File"} deleted successfully`
      );
      loadFiles();
    } catch (error: any) {
      console.error("Error deleting item:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to delete item");
      toast.error("Failed to delete item");
    }
  };

  const handleDownload = async (item: FileItem) => {
    try {
      console.log('Generating download URL for:', item.file_name);
      const { data, error } = await supabase.storage
        .from("user_files")
        .createSignedUrl(item.file_path, 60);

      if (error) throw error;

      console.log('Download URL generated successfully');
      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      console.error("Error downloading file:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to download file");
      toast.error("Failed to download file");
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
        </div>
      </div>

      {isCreatingFolder && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button 
            onClick={handleCreateFolder} 
            disabled={isFolderProcessing || !newFolderName.trim()}
          >
            {isFolderProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPath !== "/" && (
            <TableRow>
              <TableCell
                className="cursor-pointer hover:text-primary"
                onClick={() =>
                  navigateToFolder(
                    currentPath.split("/").slice(0, -2).join("/") + "/"
                  )
                }
              >
                <div className="flex items-center">
                  <Folder className="w-4 h-4 mr-2" />
                  ..
                </div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>Folder</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          )}
          {files.map((item) => (
            <TableRow key={item.id}>
              <TableCell
                className={
                  item.is_folder ? "cursor-pointer hover:text-primary" : ""
                }
                onClick={() =>
                  item.is_folder && navigateToFolder(item.file_path)
                }
              >
                <div className="flex items-center">
                  {item.is_folder ? (
                    <Folder className="w-4 h-4 mr-2" />
                  ) : (
                    <File className="w-4 h-4 mr-2" />
                  )}
                  {item.file_name}
                </div>
              </TableCell>
              <TableCell>
                {item.size ? Math.round(item.size / 1024) + " KB" : "-"}
              </TableCell>
              <TableCell>{item.is_folder ? "Folder" : item.mime_type}</TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {!item.is_folder && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {files.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <p className="text-muted-foreground">No files in this folder</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
