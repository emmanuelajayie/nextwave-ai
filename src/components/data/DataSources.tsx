
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
import { RefreshCw, Link2Off, Eye, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const fetchDataSources = async () => {
    if (!user) return;
    
    try {
      setError(null);
      console.log("Fetching data sources for user:", user.id);
      
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching data sources:", error);
        setError(error.message);
        throw error;
      }
      
      console.log("Fetched data sources:", data?.length || 0);
      setSources(data || []);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch data sources";
      console.error("Error in fetchDataSources:", errorMsg);
      ErrorLogger.logError(error instanceof Error ? error : new Error(errorMsg));
    }
  };

  useEffect(() => {
    if (user) {
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
  }, [user]);

  const handleRefresh = async (sourceId: string) => {
    setIsRefreshing(true);
    try {
      await supabase
        .from("data_sources")
        .update({
          last_sync: new Date().toISOString(),
          status: "Syncing"
        })
        .eq("id", sourceId);
        
      // Simulate syncing process
      setTimeout(async () => {
        await supabase
          .from("data_sources")
          .update({
            status: "Connected"
          })
          .eq("id", sourceId);
          
        fetchDataSources();
      }, 2000);
      
      toast.success("Refreshing data source");
    } catch (error) {
      console.error("Error refreshing data source:", error);
      toast.error("Failed to refresh data source");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleView = (sourceId: string) => {
    // In a real app, this would navigate to a data preview page
    toast.info("Viewing data source details");
  };

  const handleDisconnect = async (sourceId: string) => {
    try {
      await supabase
        .from("data_sources")
        .delete()
        .eq("id", sourceId);
        
      fetchDataSources();
      toast.success("Data source disconnected");
    } catch (error) {
      console.error("Error disconnecting data source:", error);
      toast.error("Failed to disconnect data source");
    }
  };

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
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
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
                    <RefreshCw className="h-4 w-4" />
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
    </Card>
  );
};
