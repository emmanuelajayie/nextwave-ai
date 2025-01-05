import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, AlertCircle } from "lucide-react";

export const OptimizationAlerts = () => {
  const alerts = [
    {
      type: "warning",
      title: "Data Anomaly Detected",
      description: "Unusual pattern in customer behavior data",
      time: "2 hours ago",
      icon: AlertTriangle,
    },
    {
      type: "success",
      title: "Model Performance Improved",
      description: "Prediction accuracy increased by 5%",
      time: "1 day ago",
      icon: TrendingUp,
    },
    {
      type: "info",
      title: "New Data Source Available",
      description: "Connect your CRM for better insights",
      time: "2 days ago",
      icon: AlertCircle,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Optimization Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 rounded-lg border bg-background"
          >
            <div
              className={`p-2 rounded-full ${
                alert.type === "warning"
                  ? "bg-yellow-100 text-yellow-600"
                  : alert.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <alert.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{alert.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {alert.time}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};