
// This file ensures backward compatibility with imports from @/components/ui/use-toast
import {
  useToast as useToastHook,
  toast as toastFunction
} from "@/components/ui/use-toast.tsx";

export const useToast = useToastHook;
export const toast = toastFunction;
