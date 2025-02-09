
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportsSectionProps {
  schedule: string;
  time: string;
  onScheduleChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export const ReportsSection = ({
  schedule,
  time,
  onScheduleChange,
  onTimeChange,
}: ReportsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Send className="h-5 w-5 text-primary" />
        <div>
          <Label>Report Delivery</Label>
          <p className="text-sm text-muted-foreground">
            Schedule automated report sending
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select value={schedule} onValueChange={onScheduleChange}>
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
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};
