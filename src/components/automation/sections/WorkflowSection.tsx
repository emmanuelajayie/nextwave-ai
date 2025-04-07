
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";

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
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-sm text-muted-foreground">
            Schedule complete workflow execution
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
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
      
      {schedule === 'custom' && (
        <div className="flex flex-wrap gap-2 mt-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Button
              key={day}
              variant={days.includes(day) ? "default" : "outline"}
              size="sm"
              onClick={() => onDaySelection(day)}
              title={`Select ${day}`}
            >
              {day.slice(0, 3)}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
