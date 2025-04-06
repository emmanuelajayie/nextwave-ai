
export interface FileItem {
  id: string;
  file_name: string;
  file_path: string;
  folder_path: string;
  size?: number;
  mime_type?: string;
  is_folder: boolean;
  created_at: string;
}
