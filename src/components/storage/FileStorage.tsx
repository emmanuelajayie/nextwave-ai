import { useState } from "react";
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
import { Folder, File, Download, Trash2, FolderPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("file_storage")
        .select("*")
        .eq("folder_path", currentPath)
        .order("is_folder", { ascending: false })
        .order("file_name");

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
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

      toast.success("File uploaded successfully");
      loadFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const { error } = await supabase.from("file_storage").insert({
        file_name: newFolderName,
        file_path: `${currentPath}${newFolderName}/`,
        folder_path: currentPath,
        is_folder: true,
      });

      if (error) throw error;

      toast.success("Folder created successfully");
      setNewFolderName("");
      setIsCreatingFolder(false);
      loadFiles();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleDelete = async (item: FileItem) => {
    try {
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

      toast.success(
        `${item.is_folder ? "Folder" : "File"} deleted successfully`
      );
      loadFiles();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleDownload = async (item: FileItem) => {
    try {
      const { data, error } = await supabase.storage
        .from("user_files")
        .createSignedUrl(item.file_path, 60);

      if (error) throw error;

      window.open(data.signedUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    loadFiles();
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">File Storage</h2>
          <p className="text-sm text-muted-foreground">
            Manage your files and folders
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
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <File className="w-4 h-4 mr-2" />
              Upload File
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
          <Button onClick={handleCreateFolder}>Create</Button>
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
        </TableBody>
      </Table>
    </Card>
  );
};