
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { getIndustryInsights } from "@/lib/ai";
import { Building, TrendingUp, Users, Shield, Loader2 } from "lucide-react";

interface RealEstateData {
  id: string;
  date: string;
  property_valuation: number;
  market_demand_index: number;
  lead_conversion_rate: number;
  investment_potential_score: number;
  user_id: string;
}

export const RealEstateInsights = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RealEstateData[]>([]);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get session to check authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch data from Supabase
          const { data: realestateData, error } = await supabase
            .from('realestate_data')
            .select("*")
            .eq("user_id", session.user.id)
            .order("date", { ascending: true })
            .limit(30);
          
          if (error) throw error;
          
          if (realestateData && realestateData.length > 0) {
            setData(realestateData);
          }
          
          // Generate industry insights
          const realestateInsights = await getIndustryInsights("realestate");
          setInsights(realestateInsights);
        }
      } catch (error) {
        console.error("Error fetching real estate data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatData = (data: RealEstateData[]) => {
    return data.map(item => ({
      name: new Date(item.date).toLocaleDateString(),
      valuation: item.property_valuation,
      demand: item.market_demand_index,
      leads: item.lead_conversion_rate,
      investment: item.investment_potential_score
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Market Analysis</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.marketAnalysisScore?.toFixed(1) || '0'}
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.marketAnalysis || 'No data'}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Property Insights</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.propertyValuationChange?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.propertyValuation || 'No data'}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Lead Scoring</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.leadConversionRate?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.leadConversion || 'No data'}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <h3 className="font-medium">Data Security</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.securityComplianceScore?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.security || 'No data'}
          </p>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Market Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatData(data)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valuation" stroke="#3b82f6" name="Property Valuation" />
                <Line type="monotone" dataKey="demand" stroke="#10b981" name="Market Demand" />
                <Line type="monotone" dataKey="investment" stroke="#6366f1" name="Investment Potential" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium mb-4">Lead Conversion</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatData(data)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" fill="#f59e0b" name="Lead Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Market Analysis Insights</h3>
          {insights?.insights?.market ? (
            <ul className="space-y-2 text-sm">
              {insights.insights.market.map((insight: string, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No market insights available</p>
          )}
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-3">Lead Scoring Insights</h3>
          {insights?.insights?.leadScoring ? (
            <ul className="space-y-2 text-sm">
              {insights.insights.leadScoring.map((insight: string, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No lead scoring insights available</p>
          )}
        </Card>
      </div>
    </div>
  );
};
