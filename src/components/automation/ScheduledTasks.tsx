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
import { Clock, Send, BarChart, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";

export const ScheduledTasks = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [analyticsSchedule, setAnalyticsSchedule] = useState("");
  const [analyticsTime, setAnalyticsTime] = useState("");
  const [reportsSchedule, setReportsSchedule] = useState("");
  const [reportsTime, setReportsTime] = useState("");

  // Fetch existing workflow configuration
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      console.log('Fetching workflows...');
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      console.log('Fetched workflows:', data);
      return data;
    }
  });

  // Update workflow configuration
  const { mutate: updateWorkflow, isPending } = useMutation({
    mutationFn: async () => {
      console.log('Updating workflow configuration...');
      const workflowData = {
        name: 'Automated Tasks',
        config: {
          analytics: {
            schedule: analyticsSchedule,
            time: analyticsTime,
          },
          reports: {
            schedule: reportsSchedule,
            time: reportsTime,
          },
          notifications: {
            email: emailNotifications,
          },
        },
        status: 'active',
      };

      const { data, error } = await supabase
        .from('workflows')
        .upsert(workflowData)
        .select();

      if (error) {
        console.error('Error updating workflow:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Schedule settings saved successfully');
    },
    onError: (error) => {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule settings');
    },
  });

  // Handle schedule changes
  const handleScheduleChange = (value: string, type: 'analytics' | 'reports') => {
    if (type === 'analytics') {
      setAnalyticsSchedule(value);
    } else {
      setReportsSchedule(value);
    }
    console.log(`${type} schedule changed to:`, value);
  };

  // Handle notification toggle
  const handleNotificationToggle = (enabled: boolean) => {
    setEmailNotifications(enabled);
    console.log('Email notifications:', enabled);
    toast.success(`Email notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

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
            <Select 
              value={analyticsSchedule} 
              onValueChange={(value) => handleScheduleChange(value, 'analytics')}
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
              value={analyticsTime}
              onChange={(e) => setAnalyticsTime(e.target.value)}
            />
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
            <Select 
              value={reportsSchedule}
              onValueChange={(value) => handleScheduleChange(value, 'reports')}
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
              value={reportsTime}
              onChange={(e) => setReportsTime(e.target.value)}
            />
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

        <Button 
          className="w-full" 
          onClick={() => updateWorkflow()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Save Schedule Settings
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};