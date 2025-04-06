
import { Folder, File } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileActions } from "./FileActions";
import { FileItem } from "../types";

interface FileListTableProps {
  files: FileItem[];
  currentPath: string;
  navigateToFolder: (folderPath: string) => void;
  onActionComplete: () => void;
}

export const FileListTable = ({
  files,
  currentPath,
  navigateToFolder,
  onActionComplete,
}: FileListTableProps) => {
  return (
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
              <FileActions item={item} onActionComplete={onActionComplete} />
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
  );
};
