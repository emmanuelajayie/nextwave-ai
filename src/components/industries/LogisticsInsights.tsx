
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIndustryInsights } from "@/lib/ai";
import { Truck, Route, BarChart3, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export const LogisticsInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIndustryInsights("logistics");
        setInsights(data);
      } catch (error) {
        console.error("Error fetching logistics insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deliveryTimeData = [
    { name: 'Jan', average: 2.7, optimal: 2.2 },
    { name: 'Feb', average: 2.9, optimal: 2.2 },
    { name: 'Mar', average: 2.6, optimal: 2.2 },
    { name: 'Apr', average: 2.4, optimal: 2.2 },
    { name: 'May', average: 2.3, optimal: 2.2 },
    { name: 'Jun', average: 2.4, optimal: 2.2 },
  ];

  const routeEfficiencyData = [
    { name: 'Route A', actual: 85, target: 90 },
    { name: 'Route B', actual: 92, target: 90 },
    { name: 'Route C', actual: 78, target: 90 },
    { name: 'Route D', actual: 95, target: 90 },
    { name: 'Route E', actual: 88, target: 90 },
  ];

  const fuelConsumptionData = [
    { name: 'Jan', consumption: 12500 },
    { name: 'Feb', consumption: 11800 },
    { name: 'Mar', consumption: 13100 },
    { name: 'Apr', consumption: 12200 },
    { name: 'May', consumption: 11500 },
    { name: 'Jun', consumption: 10800 },
  ];

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Logistics Performance</h2>
          <p className="text-sm text-muted-foreground">Route efficiency and delivery analytics</p>
        </div>
        {insights && (
          <Badge variant="outline" className="text-primary">
            {insights.trends.deliverySpeed === "improving" ? "Delivery Speed ↑" : "Delivery Speed →"}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="delivery">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery">Delivery Performance</TabsTrigger>
          <TabsTrigger value="routes">Route Optimization</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="delivery" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Delivery Time Trends
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={deliveryTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#3b82f6" name="Avg. Delivery Time (days)" />
                    <Line type="monotone" dataKey="optimal" stroke="#10b981" strokeDasharray="5 5" name="Target Time" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Delivery Performance Metrics</h3>
              
              {insights && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <p className="font-medium text-sm">On-Time Delivery Rate</p>
                    <div className="flex items-end space-x-2 mt-1">
                      <span className="text-2xl font-bold">{insights.metrics.onTimeDeliveryRate.toFixed(1)}%</span>
                      <span className="text-sm text-green-500">+1.2% vs. last month</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <p className="font-medium text-sm">Average Transit Time</p>
                    <div className="flex items-end space-x-2 mt-1">
                      <span className="text-2xl font-bold">{insights.metrics.averageTransitTime.toFixed(1)} days</span>
                      <span className="text-sm text-green-500">-0.2 days vs. last month</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <h4 className="text-sm font-medium">Delivery Bottlenecks:</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Warehouse C processing times +12% above average</li>
                      <li>• Northern sector weather delays affecting 5% of shipments</li>
                      <li>• Weekend staffing limitations impacting Monday deliveries</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="routes" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Route className="h-5 w-5 mr-2 text-primary" />
                Route Efficiency Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={routeEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#3b82f6" name="Current Efficiency %" />
                    <Bar dataKey="target" fill="#d1d5db" name="Target Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Route Optimization Potential</h3>
              
              {insights && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <h4 className="text-sm font-medium">Optimization Opportunities:</h4>
                    {insights.opportunities.map((opportunity: string, idx: number) => (
                      <p key={idx} className="mt-2 text-sm">{opportunity}</p>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="text-sm font-medium">Fuel Efficiency</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">{insights.metrics.fuelEfficiency.toFixed(1)}</span>
                        <span className="text-sm ml-1">mpg</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <h4 className="text-sm font-medium">Route Coverage</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">87.4%</span>
                        <span className="text-sm text-amber-500 ml-2">-1.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="text-sm font-medium">High Risk Routes:</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Route C (Northern sector)</span>
                        <Badge variant="destructive">High Risk</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Route E (Last mile urban)</span>
                        <Badge variant="secondary">Medium Risk</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Fuel Consumption Trends
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fuelConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Fuel Consumption (gallons)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Resource Utilization</h3>
              
              {insights && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <p className="font-medium text-sm">Warehouse Utilization</p>
                    <div className="flex items-end space-x-2 mt-1">
                      <span className="text-2xl font-bold">{insights.metrics.warehouseUtilization.toFixed(1)}%</span>
                      <span className="text-sm text-green-500">+3.5% vs. last month</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="text-sm font-medium">Fleet Utilization</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">76.3%</span>
                        <span className="text-sm text-amber-500 ml-2">-2.1%</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <h4 className="text-sm font-medium">Return Processing</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">{insights.metrics.returnProcessingTime.toFixed(1)} days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <h4 className="text-sm font-medium">Resource Optimization Recommendations:</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Implement dynamic fleet allocation during peak periods</li>
                      <li>• Optimize warehouse layout at facility B to reduce processing time</li>
                      <li>• Consider third-party logistics support for seasonal demand spikes</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
