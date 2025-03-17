
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const HealthStatus = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'issues'>('checking');
  const [errors, setErrors] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkSystemHealth = async () => {
    setStatus('checking');
    setErrors([]);
    setIsRefreshing(true);
    
    try {
      const healthIssues: string[] = [];
      
      // Check database connection
      try {
        const { error: dbError } = await supabase
          .from('file_storage')
          .select('count')
          .limit(1)
          .single();
          
        if (dbError && !dbError.message.includes("JSON object requested")) {
          healthIssues.push(`Database error: ${dbError.message}`);
        }
      } catch (error) {
        healthIssues.push(`Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Check storage bucket
      try {
        const { error: storageError } = await supabase.storage.getBucket('user_files');
        
        if (storageError) {
          // Call the create-storage-bucket function to setup bucket if needed
          const functionUrl = `${supabase.functions.url}/create-storage-bucket`;
          const createBucketResponse = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!createBucketResponse.ok) {
            const errorData = await createBucketResponse.json();
            healthIssues.push(`Storage error: ${errorData.error || 'Unable to create storage bucket'}`);
          }
        }
      } catch (error) {
        healthIssues.push(`Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Set final status based on checks
      setErrors(healthIssues);
      setStatus(healthIssues.length > 0 ? 'issues' : 'healthy');
      
      if (healthIssues.length === 0) {
        toast.success("All systems operational");
      } else {
        toast.error(`System health check found ${healthIssues.length} issues`);
      }
    } catch (error) {
      console.error("Error checking system health:", error);
      setErrors([`Failed to complete health check: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setStatus('issues');
      toast.error("Failed to complete health check");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">System Health</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkSystemHealth}
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
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            All systems are operational
          </AlertDescription>
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
        </div>
      )}
    </Card>
  );
};
