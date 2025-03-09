
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartLine, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { analyzeTrends, getIndustryInsights } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sampleData = [
  { name: "Jan", actual: 4000, predicted: 4400 },
  { name: "Feb", actual: 3000, predicted: 3200 },
  { name: "Mar", actual: 2000, predicted: 2400 },
  { name: "Apr", actual: 2780, predicted: 2900 },
  { name: "May", actual: 1890, predicted: 2100 },
  { name: "Jun", actual: 2390, predicted: 2500 },
];

interface Insight {
  text: string;
  confidence: number;
}

export const ModelInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [trend, setTrend] = useState<string>("");
  const [accuracy, setAccuracy] = useState<number>(0);
  const [anomalies, setAnomalies] = useState<number[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<"ecommerce" | "logistics" | "finance" | "tech" | "realestate">("ecommerce");
  const [industryInsights, setIndustryInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ModelInsights component mounted");
    fetchInsights(selectedIndustry);
  }, [selectedIndustry]);

  const fetchInsights = async (industry: "ecommerce" | "logistics" | "finance" | "tech" | "realestate") => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching insights for ${industry} industry`);
      const result = await analyzeTrends(sampleData.map(d => d.actual), industry);
      console.log("Received insights:", result);
      
      // Calculate model accuracy
      const mape = sampleData.reduce((acc, curr) => {
        return acc + Math.abs((curr.actual - curr.predicted) / curr.actual);
      }, 0) / sampleData.length * 100;
      
      setAccuracy(100 - mape);
      
      // Handle insights safely
      if (result.insights && Array.isArray(result.insights)) {
        setInsights(result.insights.map(text => ({
          text,
          confidence: Math.random() * 30 + 70 // Simulated confidence scores 70-100%
        })));
      } else {
        setInsights([]);
      }
      
      // Set trend safely
      setTrend(result.trend || "No trend available");
      
      // Safely handle anomalies
      if (result.anomalies && Array.isArray(result.anomalies)) {
        setAnomalies(result.anomalies);
      } else {
        setAnomalies([]);
      }

      // Get industry specific insights
      try {
        const industryData = await getIndustryInsights(industry);
        setIndustryInsights(industryData);
      } catch (industryError) {
        console.error("Error fetching industry insights:", industryError);
        setIndustryInsights(null);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError("Failed to analyze trends. Please try again.");
      toast.error("Failed to analyze trends. Please try again.");
      setAnomalies([]);
      setInsights([]);
      setTrend("No trend available");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (insightIndex: number, isHelpful: boolean) => {
    console.log("Feedback received:", { insightIndex, isHelpful });
    toast.success("Thank you for your feedback! This helps improve our predictions.");
  };

  const handleIndustryChange = (value: "ecommerce" | "logistics" | "finance" | "tech" | "realestate") => {
    setSelectedIndustry(value);
  };

  // If there was an error loading the component, show a fallback UI
  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ChartLine className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Model Insights</h2>
        </div>
        <div className="p-4 bg-red-50 rounded-lg text-red-600">
          <p>{error}</p>
          <Button 
            onClick={() => fetchInsights(selectedIndustry)} 
            variant="outline" 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ChartLine className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Model Insights</h2>
        <div className="ml-auto flex items-center gap-4">
          <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="realestate">Real Estate</SelectItem>
            </SelectContent>
          </Select>
          {!loading && (
            <span className="text-sm text-muted-foreground">
              Model Accuracy: {accuracy.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#8884d8" 
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#82ca9d" 
                name="Predicted"
              />
              {anomalies.map((idx) => (
                <ReferenceLine 
                  key={`anomaly-${idx}`}
                  x={sampleData[idx]?.name} 
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "Anomaly", position: "top" }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Key Findings</h3>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ul className="space-y-4">
                {insights.length > 0 ? insights.map((insight, index) => (
                  <li key={index} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm text-gray-600">{insight.text}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {insight.confidence.toFixed(1)}% confidence
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(index, true)}
                        className="h-6 px-2"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(index, false)}
                        className="h-6 px-2"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Not Helpful
                      </Button>
                    </div>
                  </li>
                )) : (
                  <p className="text-sm text-gray-500">No insights available for this selection.</p>
                )}
              </ul>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Trend Analysis</h3>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="font-medium">Current Trend: {trend}</p>
                {industryInsights && (
                  <div className="mt-3">
                    <h4 className="font-medium text-primary">{selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)} Insights</h4>
                    <div className="mt-2 space-y-2">
                      {selectedIndustry === "ecommerce" && industryInsights.metrics && (
                        <>
                          <p><span className="font-medium">Cart Abandonment:</span> {industryInsights.metrics.cartAbandonmentRate?.toFixed(1)}%</p>
                          <p><span className="font-medium">Conversion Rate:</span> {industryInsights.metrics.conversionRate?.toFixed(1)}%</p>
                        </>
                      )}
                      {selectedIndustry === "logistics" && industryInsights.metrics && (
                        <>
                          <p><span className="font-medium">On-Time Delivery:</span> {industryInsights.metrics.onTimeDeliveryRate?.toFixed(1)}%</p>
                          <p><span className="font-medium">Transit Time:</span> {industryInsights.metrics.averageTransitTime?.toFixed(1)} days</p>
                        </>
                      )}
                      {selectedIndustry === "finance" && industryInsights.metrics && (
                        <>
                          <p><span className="font-medium">Customer Acquisition Cost:</span> ${industryInsights.metrics.customerAcquisitionCost?.toFixed(2)}</p>
                          <p><span className="font-medium">Customer Lifetime Value:</span> ${industryInsights.metrics.customerLifetimeValue?.toFixed(2)}</p>
                        </>
                      )}
                      {selectedIndustry === "tech" && industryInsights.metrics && (
                        <>
                          <p><span className="font-medium">User Engagement:</span> {industryInsights.metrics.userEngagementRate?.toFixed(1)}%</p>
                          <p><span className="font-medium">Feature Adoption:</span> {industryInsights.metrics.featureAdoptionRate?.toFixed(1)}%</p>
                        </>
                      )}
                      {selectedIndustry === "realestate" && industryInsights.metrics && (
                        <>
                          <p><span className="font-medium">Market Analysis Score:</span> {industryInsights.metrics.marketAnalysisScore?.toFixed(1)}</p>
                          <p><span className="font-medium">Property Valuation Change:</span> {industryInsights.metrics.propertyValuationChange?.toFixed(1)}%</p>
                        </>
                      )}
                      {industryInsights.insights && selectedIndustry === "finance" && (
                        <div className="mt-3">
                          <h5 className="font-medium">Key Insights:</h5>
                          <ul className="list-disc list-inside mt-1">
                            {industryInsights.insights.userBehavior?.slice(0, 2).map((insight: string, idx: number) => (
                              <li key={idx}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
