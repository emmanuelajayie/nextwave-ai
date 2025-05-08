
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Loader2, 
  AlertCircle, 
  Database, 
  FileSpreadsheet,
  Calendar,
  CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { ReportsSection } from "./sections/ReportsSection";
import { WorkflowSection } from "./sections/WorkflowSection";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const ScheduledTasks = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [analyticsSchedule, setAnalyticsSchedule] = useState("");
  const [analyticsTime, setAnalyticsTime] = useState("");
  const [reportsSchedule, setReportsSchedule] = useState("");
  const [reportsTime, setReportsTime] = useState("");
  const [workflowSchedule, setWorkflowSchedule] = useState("");
  const [workflowTime, setWorkflowTime] = useState("");
  const [workflowDays, setWorkflowDays] = useState<string[]>([]);
  const [selectedCRMs, setSelectedCRMs] = useState<string[]>([]);
  const [storagePreference, setStoragePreference] = useState("google_sheets");
  const [sortBy, setSortBy] = useState("date");
  const [cleaningPreference, setCleaningPreference] = useState("automatic");
  const [automaticModeling, setAutomaticModeling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formChanged, setFormChanged] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { workflows, isLoading, updateWorkflow, isPending, error: workflowError } = useWorkflow();

  // Track workflow errors
  useEffect(() => {
    if (workflowError) {
      setError(workflowError instanceof Error ? workflowError.message : "Failed to load workflows");
    } else {
      setError(null);
    }
  }, [workflowError]);

  // Load initial values from workflows
  useEffect(() => {
    if (workflows && workflows.length > 0 && workflows[0].config) {
      const config = workflows[0].config;
      
      // Set general workflow settings
      if (config.analytics) {
        setAnalyticsSchedule(config.analytics.schedule || "");
        setAnalyticsTime(config.analytics.time || "");
      }
      
      if (config.reports) {
        setReportsSchedule(config.reports.schedule || "");
        setReportsTime(config.reports.time || "");
      }
      
      if (config.workflow) {
        setWorkflowSchedule(config.workflow.schedule || "");
        setWorkflowTime(config.workflow.time || "");
        setWorkflowDays(config.workflow.days || []);
      }
      
      if (config.notifications) {
        setEmailNotifications(config.notifications.email || false);
      }
      
      // Set data source preferences
      if (config.dataSources) {
        setSelectedCRMs(config.dataSources.crmTypes || []);
        setStoragePreference(config.dataSources.storagePreference || "google_sheets");
        setSortBy(config.dataSources.sortBy || "date");
        setCleaningPreference(config.dataSources.cleaningPreference || "automatic");
        setAutomaticModeling(config.dataSources.automaticModeling || false);
      }

      // Store initial values to detect changes
      setInitialValues({
        analytics: {
          schedule: config.analytics?.schedule || "",
          time: config.analytics?.time || "",
        },
        reports: {
          schedule: config.reports?.schedule || "",
          time: config.reports?.time || "",
        },
        workflow: {
          schedule: config.workflow?.schedule || "",
          time: config.workflow?.time || "",
          days: [...(config.workflow?.days || [])],
        },
        notifications: {
          email: config.notifications?.email || false,
        },
        dataSources: {
          crmTypes: [...(config.dataSources?.crmTypes || [])],
          storagePreference: config.dataSources?.storagePreference || "google_sheets",
          sortBy: config.dataSources?.sortBy || "date",
          cleaningPreference: config.dataSources?.cleaningPreference || "automatic",
          automaticModeling: config.dataSources?.automaticModeling || false,
        }
      });
      
      // Reset form changed state since we just loaded data
      setFormChanged(false);
    }
  }, [workflows]);

  // Detect form changes by comparing current values to initial values
  useEffect(() => {
    if (!initialValues) return;
    
    const currentValues = {
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
        days: [...workflowDays],
      },
      notifications: {
        email: emailNotifications,
      },
      dataSources: {
        crmTypes: [...selectedCRMs],
        storagePreference,
        sortBy,
        cleaningPreference,
        automaticModeling,
      }
    };
    
    // Deep compare function for nested objects
    const isEqual = (obj1: any, obj2: any): boolean => {
      if (obj1 === obj2) return true;
      if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return obj1 === obj2;
      }
      
      // Handle arrays
      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        return obj1.every((val, idx) => isEqual(val, obj2[idx]));
      }
      
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      
      if (keys1.length !== keys2.length) return false;
      
      return keys1.every(key => keys2.includes(key) && isEqual(obj1[key], obj2[key]));
    };
    
    const hasChanged = !isEqual(currentValues, initialValues);
    setFormChanged(hasChanged);
    
    console.log("Form changed:", hasChanged);
  }, [
    initialValues,
    analyticsSchedule,
    analyticsTime,
    reportsSchedule,
    reportsTime,
    workflowSchedule,
    workflowTime,
    workflowDays,
    emailNotifications,
    selectedCRMs,
    storagePreference,
    sortBy,
    cleaningPreference,
    automaticModeling
  ]);

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

  // Handle CRM selection
  const handleCRMSelection = (crm: string) => {
    setSelectedCRMs(prev => 
      prev.includes(crm)
        ? prev.filter(c => c !== crm)
        : [...prev, crm]
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
      dataSources: {
        crmTypes: selectedCRMs,
        storagePreference,
        sortBy,
        cleaningPreference,
        automaticModeling,
      }
    };
    
    updateWorkflow(config);
    toast.success("Settings saved successfully!");
  };

  // Add a useEffect to track the isPending state and update UI accordingly
  useEffect(() => {
    if (!isPending && !workflowError && formChanged) {
      // This runs after a successful update
      setInitialValues({
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
          days: [...workflowDays],
        },
        notifications: {
          email: emailNotifications,
        },
        dataSources: {
          crmTypes: [...selectedCRMs],
          storagePreference,
          sortBy,
          cleaningPreference,
          automaticModeling,
        }
      });
      
      // Reset form changed state
      setFormChanged(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  }, [isPending, workflowError, formChanged, analyticsSchedule, analyticsTime, 
      reportsSchedule, reportsTime, workflowSchedule, workflowTime, 
      workflowDays, emailNotifications, selectedCRMs, 
      storagePreference, sortBy, cleaningPreference, automaticModeling]);

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
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <Label>CRM Data Sources</Label>
                <p className="text-sm text-muted-foreground">
                  Select which CRM systems to collect data from
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['hubspot', 'salesforce', 'zoho', 'custom'].map((crm) => (
                <Button
                  key={crm}
                  variant={selectedCRMs.includes(crm) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCRMSelection(crm)}
                  className="capitalize"
                >
                  {crm}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2 pt-4">
              <Label>Storage Preference</Label>
              <Select value={storagePreference} onValueChange={setStoragePreference}>
                <SelectTrigger>
                  <SelectValue placeholder="Select storage option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_sheets">Google Sheets</SelectItem>
                  <SelectItem value="excel_online">Excel Online</SelectItem>
                  <SelectItem value="local_excel">Local Excel Files</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pt-4">
              <Label>Sort Data By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="customer_name">Customer Name</SelectItem>
                  <SelectItem value="lead_score">Lead Score</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="automation" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <div>
                <Label>Data Cleaning Preferences</Label>
                <p className="text-sm text-muted-foreground">
                  Choose how data should be cleaned
                </p>
              </div>
            </div>
            
            <Select value={cleaningPreference} onValueChange={setCleaningPreference}>
              <SelectTrigger>
                <SelectValue placeholder="Select data cleaning method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Fully Automatic</SelectItem>
                <SelectItem value="interactive">Interactive (Prompt for decisions)</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
                <SelectItem value="scheduled">Scheduled (No interaction)</SelectItem>
              </SelectContent>
            </Select>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label>Automatic Predictive Modeling</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create models after data cleaning
                </p>
              </div>
              <Switch
                checked={automaticModeling}
                onCheckedChange={setAutomaticModeling}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
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
          </div>
        </TabsContent>
      </Tabs>

      <Button 
        className="w-full" 
        onClick={handleSubmit}
        disabled={isPending || !!error || !formChanged}
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
