
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CRMTableHeader } from "./crm/CRMTableHeader";
import { CRMTableRow } from "./crm/CRMTableRow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ErrorLogger from "@/utils/errorLogger";

type CRMIntegration = {
  id: string;
  name: string;
  crm_type: "hubspot" | "zoho" | "salesforce" | "custom";
  status: string;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
  api_key: string;
  config: any;
  oauth_data: any;
  webhook_url: string;
};

const ITEMS_PER_PAGE = 10;

export const CRMList = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setError(null);
      console.log("Fetching CRM integrations, page:", page);
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("crm_integrations")
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching integrations:", error);
        setError(error.message);
        throw error;
      }

      console.log("Fetched integrations:", data?.length);
      setIntegrations(prev => page === 0 ? data || [] : [...prev, ...(data || [])]);
      setHasMore((count || 0) > (page + 1) * ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to load CRM integrations";
      toast.error("Failed to load CRM integrations. Please try again.");
      ErrorLogger.logError(error instanceof Error ? error : new Error(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [page]);

  const handleSync = async (id: string) => {
    try {
      console.log("Syncing CRM integration:", id);
      const { error } = await supabase
        .from("crm_integrations")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Sync initiated successfully");
      fetchIntegrations();
    } catch (error) {
      console.error("Error syncing:", error);
      toast.error("Failed to sync with CRM. Please try again.");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to sync with CRM"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting CRM integration:", id);
      const { error } = await supabase
        .from("crm_integrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Integration removed successfully");
      setPage(0); // Reset to first page
      fetchIntegrations();
    } catch (error) {
      console.error("Error deleting integration:", error);
      toast.error("Failed to remove integration. Please try again.");
      ErrorLogger.logError(error instanceof Error ? error : new Error("Failed to remove integration"));
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">CRM Integrations</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading && page === 0 ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <CRMTableHeader />
            <TableBody>
              {integrations.map((integration) => (
                <CRMTableRow
                  key={integration.id}
                  integration={integration as any}
                  onSync={handleSync}
                  onDelete={handleDelete}
                />
              ))}
              {integrations.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted-foreground p-8">
                    No CRM integrations configured yet. Connect your first CRM above.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>

          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                ) : (
                  'Load more'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
