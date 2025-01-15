import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMTableHeader } from "./crm/CRMTableHeader";
import { CRMTableRow } from "./crm/CRMTableRow";
import { Database } from "@/integrations/supabase/types";

type CRMIntegration = Database["public"]["Tables"]["crm_integrations"]["Row"];

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
        <CRMTableHeader />
        <TableBody>
          {integrations.map((integration) => (
            <CRMTableRow
              key={integration.id}
              integration={integration}
              onSync={handleSync}
              onDelete={handleDelete}
            />
          ))}
          {integrations.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted-foreground p-4">
                No CRM integrations configured
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};