
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Link2Off, Eye, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorLogger from "@/utils/errorLogger";

// Define a type for data sources
type DataSource = {
  id: string;
  name: string;
  type: string;
  last_sync: string | null;
  status: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "Connected":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "Error":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "Syncing":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

export const DataSources = () => {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useQuery to fetch the authenticated user
  const { data: authData, isLoading: isAuthLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const fetchDataSources = async () => {
    // Don't try to fetch if we don't have session data yet
    if (!authData?.session?.user) {
      console.log("Skipping data source fetch - no authenticated user");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const userId = authData.session.user.id;
      console.log("Fetching data sources for user:", userId);
      
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching data sources:", error);
        setError(`Failed to load data sources: ${error.message}`);
        ErrorLogger.logError(new Error(error.message), "Failed to fetch data sources");
        return;
      }
      
      console.log("Fetched data sources:", data?.length || 0);
      setSources(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch data sources";
      console.error("Error in fetchDataSources:", errorMsg);
      setError(errorMsg);
      ErrorLogger.logError(err instanceof Error ? err : new Error(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data sources when we have authentication data
    if (!isAuthLoading && authData?.session) {
      fetchDataSources();
    }
    
    // Listen for updates from the DataImport component
    const handleDataSourceUpdate = () => {
      fetchDataSources();
    };
    
    window.addEventListener("data-source-updated", handleDataSourceUpdate);
    
    return () => {
      window.removeEventListener("data-source-updated", handleDataSourceUpdate);
    };
  }, [isAuthLoading, authData]);

  const handleRefresh = async (sourceId: string) => {
    if (!authData?.session?.user) {
      toast.error("You must be logged in to refresh data sources");
      return;
    }

    setIsRefreshing(true);
    try {
      const { error } = await supabase
        .from("data_sources")
        .update({
          last_sync: new Date().toISOString(),
          status: "Syncing"
        })
        .eq("id", sourceId)
        .eq("user_id", authData.session.user.id);
      
      if (error) {
        throw new Error(`Failed to refresh data source: ${error.message}`);
      }
        
      // Simulate syncing process
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from("data_sources")
          .update({
            status: "Connected"
          })
          .eq("id", sourceId)
          .eq("user_id", authData.session.user.id);
          
        if (updateError) {
          console.error("Error updating data source status:", updateError);
        }
          
        fetchDataSources();
      }, 2000);
      
      toast.success("Refreshing data source");
    } catch (error) {
      console.error("Error refreshing data source:", error);
      toast.error(error instanceof Error ? error.message : "Failed to refresh data source");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to refresh data source"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleView = (sourceId: string) => {
    // In a real app, this would navigate to a data preview page
    toast.info("Viewing data source details");
  };

  const handleDisconnect = async (sourceId: string) => {
    if (!authData?.session?.user) {
      toast.error("You must be logged in to disconnect data sources");
      return;
    }

    try {
      const { error } = await supabase
        .from("data_sources")
        .delete()
        .eq("id", sourceId)
        .eq("user_id", authData.session.user.id);
        
      if (error) {
        throw new Error(`Failed to disconnect data source: ${error.message}`);
      }
        
      fetchDataSources();
      toast.success("Data source disconnected");
    } catch (error) {
      console.error("Error disconnecting data source:", error);
      toast.error(error instanceof Error ? error.message : "Failed to disconnect data source");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to disconnect data source"));
    }
  };

  // If we're still loading auth data, show a loading indicator
  if (isAuthLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Connected Data Sources</h2>
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking authentication...</span>
        </div>
      </Card>
    );
  }

  // If we're not authenticated, show an error
  if (!authData?.session) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Connected Data Sources</h2>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to view your data sources.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // If no custom sources yet, show the default mock data
  const displaySources = sources.length > 0 ? sources : [
    {
      id: "1",
      name: "Sales Data 2024",
      type: "Google Sheets",
      last_sync: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      status: "Connected",
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "Marketing Metrics",
      type: "Excel Online",
      last_sync: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "Error",
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      name: "Customer Analysis",
      type: "Excel File",
      last_sync: new Date().toISOString(), // Just now
      status: "Syncing",
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];

  // Format the last sync time to be more readable
  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Connected Data Sources</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading data sources...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell>{source.type}</TableCell>
                <TableCell>{formatLastSync(source.last_sync)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(source.status)}
                  >
                    {source.status || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRefresh(source.id)}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(source.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDisconnect(source.id)}
                    >
                      <Link2Off className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};
