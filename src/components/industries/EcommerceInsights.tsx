
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIndustryInsights } from "@/lib/ai";
import { ShoppingCart, TrendingUp, UserX, Loader2 } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const EcommerceInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIndustryInsights("ecommerce");
        setInsights(data);
      } catch (error) {
        console.error("Error fetching ecommerce insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const conversionData = [
    { name: 'View', value: 100 },
    { name: 'Add to Cart', value: 40 },
    { name: 'Checkout', value: 25 },
    { name: 'Purchase', value: 15 },
  ];

  const abandonmentData = [
    { name: 'Mon', rate: 65 },
    { name: 'Tue', rate: 59 },
    { name: 'Wed', rate: 80 },
    { name: 'Thu', rate: 71 },
    { name: 'Fri', rate: 56 },
    { name: 'Sat', rate: 55 },
    { name: 'Sun', rate: 60 },
  ];

  const customerSegments = [
    { name: 'New Customers', value: 35 },
    { name: 'Returning', value: 45 },
    { name: 'High Value', value: 20 },
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
          <h2 className="text-xl font-semibold">E-commerce Analytics</h2>
          <p className="text-sm text-muted-foreground">Customer behavior and sales insights</p>
        </div>
        {insights && (
          <Badge variant="outline" className="text-primary">
            {insights.trends.mobileUsage === "increasing" ? "Mobile Traffic ↑" : "Mobile Traffic →"}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="abandonment">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="abandonment">Cart Abandonment</TabsTrigger>
          <TabsTrigger value="behavior">Customer Behavior</TabsTrigger>
          <TabsTrigger value="performance">Sales Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="abandonment" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                Cart Abandonment Tracking
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={abandonmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Abandonment Rate']} />
                    <Line type="monotone" dataKey="rate" stroke="#f43f5e" name="Abandonment Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <UserX className="h-5 w-5 mr-2 text-primary" />
                Abandonment Insights
              </h3>
              
              {insights && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <p className="font-medium text-sm">Current Abandonment Rate</p>
                    <div className="flex items-end space-x-2 mt-1">
                      <span className="text-2xl font-bold">{insights.metrics.cartAbandonmentRate.toFixed(1)}%</span>
                      <span className="text-sm text-red-500">+2.4% vs. last month</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Top Abandonment Reasons:</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Unexpected shipping costs</span>
                        <Badge variant="secondary">42%</Badge>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Account creation required</span>
                        <Badge variant="secondary">28%</Badge>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Complex checkout process</span>
                        <Badge variant="secondary">21%</Badge>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <h4 className="text-sm font-medium">Recommendation:</h4>
                    <p className="mt-1 text-sm">Implement guest checkout option and display shipping costs earlier in the process to reduce abandonment by ~15%.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Customer Journey Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Conversion Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Segments</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {insights && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <h4 className="text-sm font-medium">Conversion Rate</h4>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{insights.metrics.conversionRate.toFixed(1)}%</span>
                  <span className="text-sm text-green-500 ml-2">+0.3% vs. last month</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h4 className="text-sm font-medium">Avg. Order Value</h4>
                <div className="mt-2">
                  <span className="text-2xl font-bold">${insights.metrics.averageOrderValue.toFixed(2)}</span>
                  <span className="text-sm text-green-500 ml-2">+$4.20 vs. last month</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h4 className="text-sm font-medium">Customer Acquisition Cost</h4>
                <div className="mt-2">
                  <span className="text-2xl font-bold">${insights.metrics.customerAcquisitionCost.toFixed(2)}</span>
                  <span className="text-sm text-red-500 ml-2">+$1.50 vs. last month</span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="pt-4">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Sales Performance Metrics</h3>
            
            {insights && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Return Rate</h4>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{insights.metrics.returnRate.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Industry average: 12.1%
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Mobile Purchase Rate</h4>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">38.2%</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Trending upward (+5.4%)
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Repeat Purchase Rate</h4>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">27.8%</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Target: 30%
                  </div>
                </Card>
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Opportunities for Improvement</h3>
              
              {insights && (
                <ul className="space-y-2">
                  {insights.opportunities.map((opportunity: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-lg bg-primary/5 border">
                      {opportunity}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
