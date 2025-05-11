
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWorkflow } from '@/hooks/useWorkflow';

export interface WorkflowConfig {
  analytics: {
    schedule: string;
    time: string;
  };
  reports: {
    schedule: string;
    time: string;
  };
  workflow: {
    schedule: string;
    time: string;
    days: string[];
  };
  notifications: {
    email: boolean;
  };
  dataSources: {
    crmTypes: string[];
    storagePreference: string;
    sortBy: string;
    cleaningPreference: string;
    automaticModeling: boolean;
  };
}

export const useScheduledTasksForm = () => {
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
  const [initialValues, setInitialValues] = useState<WorkflowConfig | null>(null);
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
      try {
        const config = workflows[0].config;
        console.log("Loaded workflow config:", config);
        
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
        console.log("Form state reset after loading initial values");
      } catch (error) {
        console.error("Error parsing workflow config:", error);
        setError("Failed to load workflow configuration");
      }
    }
  }, [workflows]);

  // Check if form has valid schedule configurations
  const hasValidScheduleConfig = () => {
    const hasAnalyticsConfig = analyticsSchedule && analyticsTime;
    const hasReportsConfig = reportsSchedule && reportsTime;
    const hasWorkflowConfig = workflowSchedule && workflowTime && 
      (workflowSchedule !== 'custom' || (workflowSchedule === 'custom' && workflowDays.length > 0));
    
    const isValid = hasAnalyticsConfig || hasReportsConfig || hasWorkflowConfig;
    console.log("Schedule config validation:", { 
      isValid,
      hasAnalyticsConfig,
      hasReportsConfig,
      hasWorkflowConfig 
    });
    
    return isValid;
  };

  // Monitor form changes
  useEffect(() => {
    if (!initialValues) {
      setFormChanged(false);
      return;
    }
    
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
    
    // Ensure deep comparison by converting to JSON strings
    const initialJSON = JSON.stringify(initialValues);
    const currentJSON = JSON.stringify(currentValues);
    
    // Check if any values have changed from initial state
    const hasChanged = initialJSON !== currentJSON;
    
    console.log("Form changed check:", { 
      hasChanged, 
      hasValidConfig: hasValidScheduleConfig(),
      analyticsTime,
      analyticsSchedule,
      reportsTime,
      reportsSchedule,
      workflowTime,
      workflowSchedule
    });
    
    setFormChanged(hasChanged);
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

  // Handle day selection for workflow
  const handleDaySelection = (day: string) => {
    console.log("Day selection changed:", day);
    setWorkflowDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Handle CRM selection
  const handleCRMSelection = (crm: string) => {
    console.log("CRM selection:", crm);
    setSelectedCRMs(prev => 
      prev.includes(crm)
        ? prev.filter(c => c !== crm)
        : [...prev, crm]
    );
  };

  const handleSubmit = () => {
    // If there are no changes, don't submit
    if (!formChanged) {
      toast.info("No changes to save");
      return;
    }

    console.log("Submitting form with changes");

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
    
    console.log("Submitting configuration:", config);
    updateWorkflow(config);
  };

  // Effect for handling successful updates
  useEffect(() => {
    if (!isPending && !workflowError && formChanged) {
      // This runs after a successful update
      console.log("Update successful, resetting form state");
      
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
      
      // Show success toast
      toast.success("Settings saved successfully!");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  }, [isPending, workflowError, formChanged]);

  // Check if the form is valid and if the button should be enabled
  const isButtonDisabled = !formChanged;

  return {
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
    formChanged,
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
    setSaveSuccess,
    handleSubmit,
    
    // Helper functions
    hasValidScheduleConfig
  };
};
