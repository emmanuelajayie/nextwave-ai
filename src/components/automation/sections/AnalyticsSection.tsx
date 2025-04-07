
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart, InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "sonner";

interface AnalyticsSectionProps {
  schedule: string;
  time: string;
  onScheduleChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export const AnalyticsSection = ({
  schedule,
  time,
  onScheduleChange,
  onTimeChange,
}: AnalyticsSectionProps) => {
  const handleScheduleChange = (value: string) => {
    onScheduleChange(value);
    toast.success(`Analytics schedule set to ${value}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <BarChart className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label>Analytics Process</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">
                  Schedule automated data analysis runs to generate insights and metrics about your business performance.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-sm text-muted-foreground">
            Schedule automated analytics runs
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select value={schedule} onValueChange={handleScheduleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="time" 
          value={time}
          onChange={(e) => {
            onTimeChange(e.target.value);
            toast.success(`Analytics time set to ${e.target.value}`);
          }}
        />
      </div>
    </div>
  );
};
