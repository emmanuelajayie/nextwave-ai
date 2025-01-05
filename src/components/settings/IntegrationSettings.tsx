import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileSpreadsheet, Link2, Unlink } from "lucide-react";

export const IntegrationSettings = () => {
  const integrations = [
    {
      name: "Google Sheets",
      status: "Connected",
      icon: FileSpreadsheet,
    },
    {
      name: "Excel Online",
      status: "Disconnected",
      icon: FileSpreadsheet,
    },
    {
      name: "CRM System",
      status: "Connected",
      icon: Link2,
    },
  ];

  const handleConnection = (name: string, action: "connect" | "disconnect") => {
    toast.success(`${name} ${action === "connect" ? "connected" : "disconnected"} successfully`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Integration Management</h2>
      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <integration.icon className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{integration.name}</p>
                <Badge
                  variant={integration.status === "Connected" ? "default" : "secondary"}
                >
                  {integration.status}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleConnection(
                  integration.name,
                  integration.status === "Connected" ? "disconnect" : "connect"
                )
              }
            >
              {integration.status === "Connected" ? (
                <>
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};