import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CleaningOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const DataCleaningPreferences = () => {
  const [options, setOptions] = React.useState<CleaningOption[]>([
    {
      id: "duplicates",
      title: "Remove Duplicates",
      description: "Automatically detect and remove duplicate entries in your datasets",
      enabled: true,
    },
    {
      id: "standardize",
      title: "Standardize Formats",
      description: "Convert data to consistent formats (dates, numbers, text)",
      enabled: true,
    },
    {
      id: "missing",
      title: "Handle Missing Values",
      description: "Fill missing values with statistical methods or remove incomplete rows",
      enabled: false,
    },
    {
      id: "outliers",
      title: "Detect Outliers",
      description: "Identify and flag statistical outliers in numerical data",
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
    toast.success(`${options.find(o => o.id === id)?.title} ${options.find(o => o.id === id)?.enabled ? 'disabled' : 'enabled'}`);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Data Cleaning Preferences</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                These settings will be applied automatically when cleaning your data
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-6">
        {options.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={option.id}>{option.title}</Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Switch
              id={option.id}
              checked={option.enabled}
              onCheckedChange={() => handleToggle(option.id)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};