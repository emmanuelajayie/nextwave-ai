
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Calendar, CheckCircle } from "lucide-react";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { ReportsSection } from "./sections/ReportsSection";
import { WorkflowSection } from "./sections/WorkflowSection";
import { DataSourcesSection } from "./sections/DataSourcesSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScheduledTasksForm } from "@/hooks/useScheduledTasksForm";

export const ScheduledTasks = () => {
  const {
    // Form state
    emailNotifications,
    analyticsSchedule,
    analyticsTime,
    reportsSchedule,
    reportsTime,
    workflowSchedule,
    workflowTime,
    workflowDays,
    selectedCRMs,
    storagePreference,
    sortBy,
    cleaningPreference,
    automaticModeling,
    
    // UI state
    error,
    saveSuccess,
    isLoading,
    isPending,
    isButtonDisabled,
    
    // Handlers
    setEmailNotifications,
    setAnalyticsSchedule,
    setAnalyticsTime,
    setReportsSchedule,
    setReportsTime,
    setWorkflowSchedule,
    setWorkflowTime,
    handleDaySelection,
    handleCRMSelection,
    setStoragePreference,
    setSortBy,
    setCleaningPreference,
    setAutomaticModeling,
    handleSubmit
  } = useScheduledTasksForm();

  // Handle schedule changes
  const handleScheduleChange = (value: string, type: 'analytics' | 'reports' | 'workflow') => {
    console.log(`${type} schedule changed to:`, value);
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
      <h2 className="text-lg font-semibold mb-4">Scheduled Tasks & Automation</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert variant="success" className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="schedule" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Schedule Settings</TabsTrigger>
          <TabsTrigger value="data">Data Collection & Storage</TabsTrigger>
          <TabsTrigger value="automation">Automation Workflow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <DataSourcesSection
            selectedCRMs={selectedCRMs}
            storagePreference={storagePreference}
            sortBy={sortBy}
            cleaningPreference={cleaningPreference}
            automaticModeling={automaticModeling}
            onCRMSelection={handleCRMSelection}
            onStoragePreferenceChange={setStoragePreference}
            onSortByChange={setSortBy}
            onCleaningPreferenceChange={setCleaningPreference}
            onAutomaticModelingChange={setAutomaticModeling}
          />
        </TabsContent>
        
        <TabsContent value="automation" className="space-y-6">
          <NotificationsSection
            emailNotifications={emailNotifications}
            onEmailNotificationsChange={setEmailNotifications}
          />
        </TabsContent>
      </Tabs>

      <Button 
        className="w-full" 
        onClick={handleSubmit}
        disabled={isButtonDisabled}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            Save Automation Settings
          </>
        )}
      </Button>
    </Card>
  );
};
