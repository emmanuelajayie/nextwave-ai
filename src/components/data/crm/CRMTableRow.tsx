import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type CRMIntegration = Database["public"]["Tables"]["crm_integrations"]["Row"];

interface CRMTableRowProps {
  integration: CRMIntegration;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CRMTableRow = ({ integration, onSync, onDelete }: CRMTableRowProps) => {
  return (
    <TableRow>
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
            onClick={() => onSync(integration.id)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(integration.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};