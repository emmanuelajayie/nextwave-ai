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
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CRMIntegration {
  id: string;
  name: string;
  crm_type: string;
  status: string;
  last_sync_at: string | null;
  oauth_data: Record<string, any> | null;
}

export const CRMList = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_integrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      toast.error("Failed to load CRM integrations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSync = async (id: string) => {
    try {
      const { error } = await supabase
        .from("crm_integrations")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Sync initiated successfully");
      fetchIntegrations();
    } catch (error) {
      console.error("Error syncing:", error);
      toast.error("Failed to sync with CRM");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("crm_integrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Integration removed successfully");
      fetchIntegrations();
    } catch (error) {
      console.error("Error deleting integration:", error);
      toast.error("Failed to remove integration");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">CRM Integrations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell className="font-medium">{integration.name}</TableCell>
              <TableCell className="capitalize">{integration.crm_type}</TableCell>
              <TableCell>
                <Badge
                  variant={integration.status === "active" ? "default" : "secondary"}
                >
                  {integration.status}
                </Badge>
              </TableCell>
              <TableCell>
                {integration.last_sync_at
                  ? new Date(integration.last_sync_at).toLocaleString()
                  : "Never"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSync(integration.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {integrations.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No CRM integrations configured
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};