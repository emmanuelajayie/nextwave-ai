
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, DatabaseIcon, KeyIcon, FolderIcon, CalendarCheck } from "lucide-react";
import BackendService from "@/lib/backend-service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ApiStatus = () => {
  const { 
    data: status,
    isLoading,
    error, 
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['apiStatus'],
    queryFn: () => BackendService.getSystemStatus(),
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("System status refreshed");
    } catch (error) {
      toast.error("Failed to refresh system status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "up":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Operational
          </Badge>
        );
      case "down":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3.5 w-3.5" />
            Down
          </Badge>
        );
      case "degraded":
        return (
          <Badge variant="destructive" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            Degraded
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            Unknown
          </Badge>
        );
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "database":
        return <DatabaseIcon className="h-4 w-4 mr-2 text-primary" />;
      case "auth":
        return <KeyIcon className="h-4 w-4 mr-2 text-primary" />;
      case "storage":
        return <FolderIcon className="h-4 w-4 mr-2 text-primary" />;
      case "workflows":
        return <CalendarCheck className="h-4 w-4 mr-2 text-primary" />;
      default:
        return <div className="w-4 mr-2" />;
    }
  };

  const getSystemStatusBadge = () => {
    if (error) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3.5 w-3.5" />
          Service Unavailable
        </Badge>
      );
    }

    if (isLoading) {
      return (
        <Badge variant="secondary" className="gap-1">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Checking...
        </Badge>
      );
    }

    if (status?.status === "healthy") {
      return (
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          All Systems Operational
        </Badge>
      );
    }

    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3.5 w-3.5" />
        System Issues Detected
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">API & Backend Status</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefetching}
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">System Status:</span>
          {getSystemStatusBadge()}
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-600 dark:text-red-400">
            Unable to connect to backend services. Please check your connection or try again later.
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {['database', 'auth', 'storage', 'workflows'].map((service) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getServiceIcon(service)}
                  <span className="text-sm capitalize">{service}</span>
                </div>
                <Badge variant="secondary" className="gap-1 bg-gray-200 dark:bg-gray-800">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {status?.services && Object.entries(status.services).map(([service, serviceStatus]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getServiceIcon(service)}
                    <span className="text-sm capitalize">{service}</span>
                  </div>
                  {getStatusBadge(serviceStatus)}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Last updated:</span>
              <span className="text-xs">
                {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'Unknown'}
              </span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">API Version:</span>
              <span className="text-xs font-mono">{status?.version || 'Unknown'}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
