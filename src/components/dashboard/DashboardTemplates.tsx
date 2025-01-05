import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { toast } from "sonner";

const templates = [
  {
    title: "Sales Analytics",
    description: "Track revenue, growth, and sales patterns",
    icon: LineChart,
  },
  {
    title: "Customer Insights",
    description: "Analyze customer behavior and segments",
    icon: PieChart,
  },
  {
    title: "Performance Metrics",
    description: "Monitor KPIs and business metrics",
    icon: BarChart3,
  },
];

export const DashboardTemplates = () => {
  const handleTemplateSelect = (template: string) => {
    console.log("Selected template:", template);
    toast.success(`${template} template applied`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Dashboard Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.title}
            className="p-4 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => handleTemplateSelect(template.title)}
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <template.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{template.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};