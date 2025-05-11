
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface NotificationsSectionProps {
  emailNotifications: boolean;
  onEmailNotificationsChange: (value: boolean) => void;
}

export const NotificationsSection = ({
  emailNotifications,
  onEmailNotificationsChange,
}: NotificationsSectionProps) => {
  const handleEmailNotificationsChange = (value: boolean) => {
    onEmailNotificationsChange(value);
    toast.success(`Email notifications ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="space-y-0.5">
        <Label>Email Notifications</Label>
        <p className="text-sm text-muted-foreground">
          Receive task completion notifications
        </p>
      </div>
      <Switch
        checked={emailNotifications}
        onCheckedChange={handleEmailNotificationsChange}
      />
    </div>
  );
};
