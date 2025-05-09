
// This file is just a direct export of the toast implementation
// to maintain compatibility with existing imports
import {
  useToast as useToastImpl,
  toast as toastImpl
} from "@/components/ui/use-toast";

export const useToast = useToastImpl;
export const toast = toastImpl;
