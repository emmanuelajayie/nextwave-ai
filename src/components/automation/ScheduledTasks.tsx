
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { ReportsSection } from "./sections/ReportsSection";
import { WorkflowSection } from "./sections/WorkflowSection";
import { useWorkflow } from "@/hooks/useWorkflow";

export const ScheduledTasks = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [analyticsSchedule, setAnalyticsSchedule] = useState("");
  const [analyticsTime, setAnalyticsTime] = useState("");
  const [reportsSchedule, setReportsSchedule] = useState("");
  const [reportsTime, setReportsTime] = useState("");
  const [workflowSchedule, setWorkflowSchedule] = useState("");
  const [workflowTime, setWorkflowTime] = useState("");
  const [workflowDays, setWorkflowDays] = useState<string[]>([]);

  const { workflows, isLoading, updateWorkflow, isPending } = useWorkflow();

  // Handle schedule changes
  const handleScheduleChange = (value: string, type: 'analytics' | 'reports' | 'workflow') => {
    switch (type) {
      case 'analytics':
        setAnalyticsSchedule(value);
        break;
      case 'reports':
        setReportsSchedule(value);
        break;
      case 'workflow':
        setWorkflowSchedule(value);
        break;
    }
    console.log(`${type} schedule changed to:`, value);
  };

  // Handle day selection for workflow
  const handleDaySelection = (day: string) => {
    setWorkflowDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = () => {
    const config = {
      analytics: {
        schedule: analyticsSchedule,
        time: analyticsTime,
      },
      reports: {
        schedule: reportsSchedule,
        time: reportsTime,
      },
      workflow: {
        schedule: workflowSchedule,
        time: workflowTime,
        days: workflowDays,
      },
      notifications: {
        email: emailNotifications,
      },
    };
    updateWorkflow(config);
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
        <AnalyticsSection
          schedule={analyticsSchedule}
          time={analyticsTime}
          onScheduleChange={(value) => handleScheduleChange(value, 'analytics')}
          onTimeChange={setAnalyticsTime}
        />

        <ReportsSection
          schedule={reportsSchedule}
          time={reportsTime}
          onScheduleChange={(value) => handleScheduleChange(value, 'reports')}
          onTimeChange={setReportsTime}
        />

        <WorkflowSection
          schedule={workflowSchedule}
          time={workflowTime}
          days={workflowDays}
          onScheduleChange={(value) => handleScheduleChange(value, 'workflow')}
          onTimeChange={setWorkflowTime}
          onDaySelection={handleDaySelection}
        />

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive task completion notifications
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <Button 
          className="w-full" 
          onClick={handleSubmit}
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
