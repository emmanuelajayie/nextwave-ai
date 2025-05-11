
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Workflow, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";

interface WorkflowSectionProps {
  schedule: string;
  time: string;
  days: string[];
  onScheduleChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDaySelection: (day: string) => void;
}

export const WorkflowSection = ({
  schedule,
  time,
  days,
  onScheduleChange,
  onTimeChange,
  onDaySelection,
}: WorkflowSectionProps) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    onTimeChange(newTime);
    
    if (newTime) {
      const timeObj = new Date(`2000-01-01T${newTime}`);
      const formattedTime = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      toast.success(`Workflow time updated to ${formattedTime}`);
    }
  };

  const handleScheduleChange = (value: string) => {
    onScheduleChange(value);
    toast.success(`Schedule frequency set to ${value}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Workflow className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label>Full Workflow</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">
                  Schedule your complete workflow execution including data collection, 
                  cleaning, analysis, and reporting at your preferred frequency.
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>• Daily: Runs every day at the specified time</p>
                  <p>• Weekly: Runs every Monday at the specified time</p>
                  <p>• Custom: Runs on selected days at the specified time</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-sm text-muted-foreground">
            Schedule complete workflow execution
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select value={schedule || "daily"} onValueChange={handleScheduleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="time"
          value={time || ""}
          onChange={handleTimeChange}
          placeholder="00:00"
        />
      </div>
      
      {(schedule === 'custom') && (
        <div className="space-y-2">
          <Label className="text-sm">Select days:</Label>
          <div className="flex flex-wrap gap-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <Button
                key={day}
                variant={days.includes(day) ? "default" : "outline"}
                size="sm"
                onClick={() => onDaySelection(day)}
                className="flex items-center gap-1"
                title={`Select ${day}`}
              >
                {days.includes(day) && <CheckCircle className="h-3 w-3" />}
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tasks will run on selected days at the specified time
          </p>
        </div>
      )}
    </div>
  );
};
