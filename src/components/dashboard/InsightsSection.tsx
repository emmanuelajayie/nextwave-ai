import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Brain } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
];

const insights = [
  {
    title: "Revenue Trend",
    description: "15% increase predicted for next quarter",
    icon: TrendingUp,
    type: "positive",
  },
  {
    title: "Anomaly Detected",
    description: "Unusual pattern in customer behavior",
    icon: AlertTriangle,
    type: "warning",
  },
  {
    title: "AI Recommendation",
    description: "Consider adjusting pricing strategy",
    icon: Brain,
    type: "info",
  },
];

const InsightsSection = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer config={{ data: { theme: { light: "#0EA5E9", dark: "#38BDF8" } } }}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0EA5E9"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="flex items-start space-x-4 p-4 rounded-lg bg-background border"
            >
              <div
                className={`p-2 rounded-full ${
                  insight.type === "positive"
                    ? "bg-green-100 text-green-600"
                    : insight.type === "warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <insight.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default InsightsSection;