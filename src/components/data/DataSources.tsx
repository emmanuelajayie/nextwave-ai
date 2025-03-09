
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
import { RefreshCw, Link2Off, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DataSource {
  id: number;
  name: string;
  type: string;
  last_sync: string;
  status: string;
}

const getStatusColor = (status: string) => {
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
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setSources(data || []);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      toast.error("Failed to fetch data sources");
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

  const handleRefresh = async (sourceId: number) => {
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

  const handleView = (sourceId: number) => {
    // In a real app, this would navigate to a data preview page
    toast.info("Viewing data source details");
  };

  const handleDisconnect = async (sourceId: number) => {
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
      id: 1,
      name: "Sales Data 2024",
      type: "Google Sheets",
      last_sync: "2 hours ago",
      status: "Connected",
    },
    {
      id: 2,
      name: "Marketing Metrics",
      type: "Excel Online",
      last_sync: "1 day ago",
      status: "Error",
    },
    {
      id: 3,
      name: "Customer Analysis",
      type: "Excel File",
      last_sync: "Just now",
      status: "Syncing",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Connected Data Sources</h2>
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
              <TableCell>{source.last_sync}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(source.status)}
                >
                  {source.status}
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
