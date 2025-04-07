
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const HealthStatus = ({ showInCard = true }) => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'issues'>('checking');
  const [errors, setErrors] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);

  const checkSystemHealth = async (silent = false) => {
    setStatus('checking');
    if (!silent) setErrors([]);
    setIsRefreshing(true);
    
    try {
      const healthIssues: string[] = [];
      
      // Check database connection
      try {
        const { data, error: dbError } = await supabase
          .from('workflows')
          .select('count')
          .limit(1)
          .single();
          
        if (dbError && !dbError.message.includes("JSON object requested")) {
          healthIssues.push(`Database error: ${dbError.message}`);
        }
      } catch (error) {
        healthIssues.push(`Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Check authentication service
      try {
        const { data, error: authError } = await supabase.auth.getSession();
        if (authError) {
          healthIssues.push(`Auth service error: ${authError.message}`);
        }
      } catch (error) {
        healthIssues.push(`Auth service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Check storage bucket
      try {
        const { data: bucketList, error: storageListError } = await supabase.storage.listBuckets();
        
        if (storageListError) {
          healthIssues.push(`Storage error: ${storageListError.message}`);
          
          // Try to create bucket if needed
          try {
            const { data: createData, error: createError } = await supabase.storage.createBucket('user_files', {
              public: false,
              fileSizeLimit: 52428800 // 50MB in bytes
            });
            
            if (createError) {
              healthIssues.push(`Storage bucket creation error: ${createError.message}`);
            } else {
              // Remove the original storage error since we fixed it
              healthIssues.pop();
              healthIssues.push('Storage bucket created successfully');
            }
          } catch (createError) {
            healthIssues.push(`Storage bucket creation exception: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        healthIssues.push(`Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Set final status based on checks
      setErrors(healthIssues);
      setStatus(healthIssues.length > 0 ? 'issues' : 'healthy');
      
      if (healthIssues.length === 0) {
        if (!silent) toast.success("All systems operational");
      } else {
        if (!silent) toast.error(`System health check found ${healthIssues.length} issues`);
        
        // Auto-retry if we have issues and haven't exceeded retry limit
        if (autoRetryCount < 2) {
          setAutoRetryCount(prev => prev + 1);
          setTimeout(() => {
            checkSystemHealth(true);
          }, 3000); // Wait 3 seconds before retry
        }
      }
    } catch (error) {
      console.error("Error checking system health:", error);
      setErrors([`Failed to complete health check: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setStatus('issues');
      if (!silent) toast.error("Failed to complete health check");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkSystemHealth(true);
    
    // Set up periodic health checks
    const intervalId = setInterval(() => {
      checkSystemHealth(true);
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  const healthContent = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">System Health</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => checkSystemHealth()}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {status === 'checking' && (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          <p>Checking system health...</p>
        </div>
      )}
      
      {status === 'healthy' && (
        <Alert className="bg-green-50 border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <AlertDescription className="text-green-700">
              All systems are operational
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {status === 'issues' && (
        <div className="space-y-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.length} {errors.length === 1 ? 'issue' : 'issues'} detected
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 mt-3">
            {errors.map((error, index) => (
              <div key={index} className="text-sm p-2 bg-muted rounded-md">
                {error}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => checkSystemHealth()}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </div>
        </div>
      )}
    </>
  );

  if (showInCard) {
    return <Card className="p-6">{healthContent}</Card>;
  }

  return <div className="p-4 border rounded-lg">{healthContent}</div>;
};
