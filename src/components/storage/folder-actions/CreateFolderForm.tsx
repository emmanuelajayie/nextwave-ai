
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ErrorLogger from "@/utils/errorLogger";
import { z } from "zod";

interface CreateFolderFormProps {
  currentPath: string;
  onFolderCreated: () => void;
}

// Schema for folder name validation
const folderNameSchema = z
  .string()
  .min(1, "Folder name is required")
  .max(255, "Folder name is too long")
  .refine(name => /^[a-zA-Z0-9_\-. ]+$/.test(name), {
    message: "Folder name contains invalid characters",
  });

export const CreateFolderForm = ({
  currentPath,
  onFolderCreated,
}: CreateFolderFormProps) => {
  const [newFolderName, setNewFolderName] = useState("");
  const [isFolderProcessing, setIsFolderProcessing] = useState(false);

  const handleCreateFolder = async () => {
    try {
      // Validate folder name
      const result = folderNameSchema.safeParse(newFolderName.trim());
      
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }
      
      setIsFolderProcessing(true);
      console.log('Creating folder:', newFolderName, 'at path:', currentPath);
      
      // Ensure folder name doesn't end with a slash (we add it)
      const sanitizedName = newFolderName.trim().replace(/\/+$/, '');
      
      // Create the new folder path by combining current path and folder name
      const newFolderPath = `${currentPath}${sanitizedName}/`;
      
      // Insert the new folder record
      const { data, error } = await supabase.from("folders").insert([{ name: folderName  }]).select();

      if (error) {
        toast.error("Failed to create folder: ' + error message);
                    return;
      }
       toast.success('Folder created successfully');             
        
        // Check for common error types
        if (error.code === '23505') {
          toast.error("A folder with this name already exists");
        } else {
          ErrorLogger.logError(new Error(error.message), "Failed to create folder");
          toast.error("Failed to create folder. Please try again.");
        }
        return;
      }

      console.log('Folder created successfully:', sanitizedName, 'data:', data);
      toast.success("Folder created successfully");
      setNewFolderName(""); // Clear the input
      onFolderCreated(); // Refresh the file list
    } catch (error: any) {
      console.error("Error creating folder:", error);
      ErrorLogger.logError(new Error(error.message), "Failed to create folder");
      toast.error("Failed to create folder. Please try again.");
    } finally {
      setIsFolderProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFolderName.trim()) {
      e.preventDefault();
      handleCreateFolder();
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Folder name"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-[200px]"
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
