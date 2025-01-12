import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Clock, Send, BarChart } from "lucide-react";
import { useState } from "react";

export const ScheduledTasks = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleScheduleChange = (value: string) => {
    console.log("Schedule changed to:", value);
    toast.success(`Task schedule set to ${value}`);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setEmailNotifications(enabled);
    toast.success(`Email notifications ${enabled ? "enabled" : "disabled"}`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Scheduled Tasks</h2>
      <div className="space-y-6">
        {/* Analytics Schedule */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <BarChart className="h-5 w-5 text-primary" />
            <div>
              <Label>Analytics Process</Label>
              <p className="text-sm text-muted-foreground">
                Schedule automated analytics runs
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={handleScheduleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Input type="time" placeholder="Select time" />
          </div>
        </div>

        {/* Report Schedule */}
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
            <Select onValueChange={handleScheduleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Input type="time" placeholder="Select time" />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive task completion notifications
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={handleNotificationToggle}
          />
        </div>

        <Button className="w-full" onClick={() => toast.success("Settings saved")}>
          <Clock className="mr-2 h-4 w-4" />
          Save Schedule Settings
        </Button>
      </div>
    </Card>
  );
};