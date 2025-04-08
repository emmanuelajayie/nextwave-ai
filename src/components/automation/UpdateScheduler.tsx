
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock } from "lucide-react";

export const UpdateScheduler = () => {
  const handleScheduleChange = (value: string) => {
    console.log("Schedule changed to:", value);
    toast.success(`Update schedule set to ${value}`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Update Schedule</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select onValueChange={handleScheduleChange} defaultValue="daily">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Select onValueChange={handleScheduleChange} defaultValue="morning">
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9 AM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (2 PM)</SelectItem>
                <SelectItem value="evening">Evening (7 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
          <Button variant="outline" className="flex-1">
            <Clock className="mr-2 h-4 w-4" />
            Run Now
          </Button>
        </div>
      </div>
    </Card>
  );
};
