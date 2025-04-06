
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ErrorLogger from "@/utils/errorLogger";
import { FileItem } from "../types";

interface FileActionsProps {
  item: FileItem;
  onActionComplete: () => void;
}

export const FileActions = ({ item, onActionComplete }: FileActionsProps) => {
  const handleDelete = async () => {
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
      onActionComplete();
    } catch (error: any) {
      console.error("Error deleting item:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to delete item");
      toast.error("Failed to delete item");
    }
  };

  const handleDownload = async () => {
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

  return (
    <div className="flex justify-end gap-2">
      {!item.is_folder && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
