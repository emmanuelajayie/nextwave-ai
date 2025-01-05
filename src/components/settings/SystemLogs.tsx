import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SystemLogs = () => {
  const logs = [
    {
      timestamp: "2024-01-05 14:30:00",
      action: "Data Sync",
      status: "success",
      description: "Successfully synced with Google Sheets",
    },
    {
      timestamp: "2024-01-05 14:15:00",
      action: "Model Update",
      status: "error",
      description: "Failed to update predictive model",
    },
    {
      timestamp: "2024-01-05 14:00:00",
      action: "Dashboard Refresh",
      status: "success",
      description: "All dashboards updated successfully",
    },
    {
      timestamp: "2024-01-05 13:45:00",
      action: "Data Cleaning",
      status: "warning",
      description: "Partial data cleaning completed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <Card className="p-6 col-span-full">
      <h2 className="text-lg font-semibold mb-4">System Logs</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {log.timestamp}
                </span>
                <Badge
                  variant="secondary"
                  className={getStatusColor(log.status)}
                >
                  {log.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">{log.action}</h3>
                <p className="text-sm text-muted-foreground">
                  {log.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};