
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const CustomizationSettings = () => {
  const handleThemeChange = (theme: string) => {
    console.log("Theme changed to:", theme);
    toast.success(`Theme updated to ${theme}`);
  };

  const handleNotificationToggle = (type: string) => {
    console.log("Notification toggled:", type);
    toast.success(`${type} notifications updated`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Customization Settings</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Dashboard Theme</Label>
          <Select onValueChange={handleThemeChange} defaultValue="light">
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Notifications</Label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                onCheckedChange={() => handleNotificationToggle("Email")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                onCheckedChange={() => handleNotificationToggle("Push")}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
