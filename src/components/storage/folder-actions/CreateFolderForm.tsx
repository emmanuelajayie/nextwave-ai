
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ErrorLogger from "@/utils/errorLogger";

interface CreateFolderFormProps {
  currentPath: string;
  onFolderCreated: () => void;
}

export const CreateFolderForm = ({
  currentPath,
  onFolderCreated,
}: CreateFolderFormProps) => {
  const [newFolderName, setNewFolderName] = useState("");
  const [isFolderProcessing, setIsFolderProcessing] = useState(false);

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
      onFolderCreated();
    } catch (error: any) {
      console.error("Error creating folder:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to create folder");
      toast.error("Failed to create folder. Please try again.");
    } finally {
      setIsFolderProcessing(false);
    }
  };

  return (
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
  );
};
