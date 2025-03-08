
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getIndustryInsights } from "@/lib/ai";
import { Shield, Users, BarChart2, TrendingUp, Loader2 } from "lucide-react";

interface TechData {
  id: string;
  date: string;
  user_engagement_rate: number;
  feature_adoption_rate: number;
  churn_rate: number;
  retention_rate: number;
  user_id: string;
}

export const TechInsights = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TechData[]>([]);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get session to check authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch data from Supabase
          const { data: techData, error } = await supabase
            .from('tech_data')
            .select("*")
            .eq("user_id", session.user.id)
            .order("date", { ascending: true })
            .limit(30);
          
          if (error) throw error;
          
          if (techData && techData.length > 0) {
            setData(techData);
          }
          
          // Generate industry insights
          const techInsights = await getIndustryInsights("tech");
          setInsights(techInsights);
        }
      } catch (error) {
        console.error("Error fetching tech data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatData = (data: TechData[]) => {
    return data.map(item => ({
      name: new Date(item.date).toLocaleDateString(),
      engagement: item.user_engagement_rate,
      adoption: item.feature_adoption_rate,
      churn: item.churn_rate,
      retention: item.retention_rate
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
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">User Engagement</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.userEngagementRate?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.userEngagement || 'No data'}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Feature Adoption</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.featureAdoptionRate?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.featureAdoption || 'No data'}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Churn Rate</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.churnRate?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.churn || 'No data'}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <h3 className="font-medium">Data Security</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {insights?.metrics?.securityScore?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-muted-foreground">
            {insights?.trends?.security || 'No data'}
          </p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="font-medium mb-4">Performance Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatData(data)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#3b82f6" name="User Engagement" />
              <Line type="monotone" dataKey="adoption" stroke="#10b981" name="Feature Adoption" />
              <Line type="monotone" dataKey="churn" stroke="#f59e0b" name="Churn Rate" />
              <Line type="monotone" dataKey="retention" stroke="#6366f1" name="Retention" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">User Behavior Insights</h3>
          {insights?.insights?.userBehavior ? (
            <ul className="space-y-2 text-sm">
              {insights.insights.userBehavior.map((insight: string, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No user behavior insights available</p>
          )}
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-3">Predictive Insights</h3>
          {insights?.insights?.predictive ? (
            <ul className="space-y-2 text-sm">
              {insights.insights.predictive.map((insight: string, idx: number) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No predictive insights available</p>
          )}
        </Card>
      </div>
    </div>
  );
};
