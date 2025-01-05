import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
];

const pieData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 300 },
];

export const CustomizableWidgets = () => {
  const handleAddWidget = () => {
    console.log("Adding new widget");
    toast.success("New widget added to dashboard");
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Dashboard Widgets</h2>
        <Button onClick={handleAddWidget}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4">Revenue Trend</h3>
          <ChartContainer config={{ data: { theme: { light: "#0EA5E9", dark: "#38BDF8" } } }}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0EA5E9" />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4">Sales Distribution</h3>
          <ChartContainer config={{ data: { theme: { light: "#0EA5E9", dark: "#38BDF8" } } }}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#0EA5E9"
              />
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </Card>
      </div>
    </Card>
  );
};