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

const sources = [
  {
    id: 1,
    name: "Sales Data 2024",
    type: "Google Sheets",
    lastSync: "2 hours ago",
    status: "Connected",
  },
  {
    id: 2,
    name: "Marketing Metrics",
    type: "Excel Online",
    lastSync: "1 day ago",
    status: "Error",
  },
  {
    id: 3,
    name: "Customer Analysis",
    type: "Excel File",
    lastSync: "Just now",
    status: "Syncing",
  },
];

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
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>{source.type}</TableCell>
              <TableCell>{source.lastSync}</TableCell>
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
                    onClick={() => console.log("Refresh", source.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("View", source.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("Disconnect", source.id)}
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