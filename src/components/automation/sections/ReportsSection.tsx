
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Send, InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "sonner";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  const handleScheduleChange = (value: string) => {
    onScheduleChange(value);
    toast.success(`Reports schedule set to ${value}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    onTimeChange(newTime);
    
    const timeObj = new Date(`2000-01-01T${newTime}`);
    const formattedTime = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    toast.success(`Report delivery time set to ${formattedTime}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Send 
          className={`h-5 w-5 transition-colors ${isHovered ? 'text-primary-dark' : 'text-primary'}`} 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label>Report Delivery</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <p className="text-sm">
                    Schedule automated report generation and delivery to keep stakeholders informed about your business performance.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reports are generated at the specified time and sent to all team members via email.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-sm text-muted-foreground">
            Schedule automated report sending
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select 
          value={schedule} 
          onValueChange={handleScheduleChange}
          disabled={false}
        >
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
          onChange={handleTimeChange}
          disabled={false}
        />
      </div>
    </div>
  );
};
