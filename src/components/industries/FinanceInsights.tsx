
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIndustryInsights } from "@/lib/ai";
import { BarChart2, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
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
  ComposedChart,
  Area,
} from "recharts";

export const FinanceInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIndustryInsights("finance");
        setInsights(data);
      } catch (error) {
        console.error("Error fetching finance insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const revenueData = [
    { name: 'Jan', revenue: 65000, expenses: 45000, profit: 20000 },
    { name: 'Feb', revenue: 59000, expenses: 40000, profit: 19000 },
    { name: 'Mar', revenue: 80000, expenses: 55000, profit: 25000 },
    { name: 'Apr', revenue: 81000, expenses: 56000, profit: 25000 },
    { name: 'May', revenue: 76000, expenses: 51000, profit: 25000 },
    { name: 'Jun', revenue: 85000, expenses: 55000, profit: 30000 },
  ];

  const riskData = [
    { name: 'Accounts Receivable', risk: 32 },
    { name: 'Foreign Exchange', risk: 58 },
    { name: 'Liquidity', risk: 27 },
    { name: 'Compliance', risk: 40 },
    { name: 'Market Volatility', risk: 65 },
  ];

  const kpiData = [
    { name: 'Q1', actual: 7.2, target: 8.0 },
    { name: 'Q2', actual: 7.8, target: 8.0 },
    { name: 'Q3', actual: 8.3, target: 8.0 },
    { name: 'Q4', actual: 8.9, target: 8.0 },
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
          <h2 className="text-xl font-semibold">Financial Analytics</h2>
          <p className="text-sm text-muted-foreground">Performance metrics and risk analysis</p>
        </div>
        {insights && (
          <Badge variant="outline" className="text-primary">
            {insights.trends.revenueGrowth === "increasing" ? "Revenue Growth ↑" : 
             insights.trends.revenueGrowth === "stable" ? "Revenue Growth →" : "Revenue Growth ↓"}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Financial Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="automation">Reporting Automation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                Revenue & Expense Trends
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Key Financial Metrics</h3>
              
              {insights && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <p className="font-medium text-sm">ROI</p>
                      <div className="flex items-end space-x-2 mt-1">
                        <span className="text-2xl font-bold">{insights.metrics.returnOnInvestment.toFixed(1)}%</span>
                        <span className="text-sm text-green-500">+0.4%</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <p className="font-medium text-sm">Operating Margin</p>
                      <div className="flex items-end space-x-2 mt-1">
                        <span className="text-2xl font-bold">{insights.metrics.operatingMargin.toFixed(1)}%</span>
                        <span className="text-sm text-green-500">+1.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <p className="font-medium text-sm">Cash Flow Ratio</p>
                      <div className="mt-1">
                        <span className="text-2xl font-bold">{insights.metrics.cashFlowRatio.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <p className="font-medium text-sm">Asset Turnover</p>
                      <div className="mt-1">
                        <span className="text-2xl font-bold">{insights.metrics.assetTurnover.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <h4 className="text-sm font-medium">Performance Insights:</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      {insights.opportunities.map((opportunity: string, idx: number) => (
                        <li key={idx}>• {opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="risk" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                Risk Assessment Matrix
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Risk Level']} />
                    <Bar dataKey="risk" fill="#f43f5e" name="Risk Level">
                      {riskData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.risk > 60 ? '#ef4444' : entry.risk > 40 ? '#f59e0b' : '#10b981'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Risk Analysis</h3>
              
              {insights && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-red-50">
                    <h4 className="text-sm font-medium text-red-700">High Risk Areas:</h4>
                    <ul className="mt-2 space-y-2">
                      {insights.risks
                        .filter((risk: any) => risk.level === "high")
                        .map((risk: any, idx: number) => (
                          <li key={idx} className="flex items-start text-sm">
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                            <span>{risk.description}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-amber-50">
                    <h4 className="text-sm font-medium text-amber-700">Medium Risk Areas:</h4>
                    <ul className="mt-2 space-y-2">
                      {insights.risks
                        .filter((risk: any) => risk.level === "medium")
                        .map((risk: any, idx: number) => (
                          <li key={idx} className="flex items-start text-sm">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                            <span>{risk.description}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="text-sm font-medium">Financial Controls Status:</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Internal Controls Assessment</span>
                        <Badge variant="secondary">Compliant</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Regulatory Compliance</span>
                        <Badge variant="secondary">Up to Date</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Data Security Controls</span>
                        <Badge variant="outline">Review Needed</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="automation" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                KPI Performance Tracking
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual ROI %" />
                    <Line type="monotone" dataKey="target" stroke="#d1d5db" strokeDasharray="5 5" name="Target ROI %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Automated Reporting</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="text-sm font-medium">Reporting Efficiency</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Close Process</span>
                      <span className="text-sm font-medium">-2.4 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">72% reduction in processing time</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="text-sm font-medium">Automated Reports</h4>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">14</span>
                      <span className="text-sm text-green-500 ml-2">+3 this month</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="text-sm font-medium">Manual Hours Saved</h4>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">42</span>
                      <span className="text-sm text-muted-foreground ml-1">hrs/mo</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border bg-primary/5">
                  <h4 className="text-sm font-medium">Automation Recommendations:</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Implement automated reconciliation for accounts payable</li>
                    <li>• Schedule financial dashboards to update every 24 hours</li>
                    <li>• Set up variance alerts for budget categories exceeding thresholds</li>
                    <li>• Establish automated tax provision calculations for quarterly reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
