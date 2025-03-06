
import { toast } from "sonner";

interface PredictionRequest {
  data: number[];
  modelType: "regression" | "classification" | "clustering";
  target?: string;
  industry?: "ecommerce" | "logistics" | "finance"; // Added industry parameter
  context?: Record<string, any>; // Added context for additional parameters
}

interface PredictionResponse {
  prediction: number[] | string[];
  confidence: number;
  insights: string[];
  recommendations?: string[]; // Added recommendations field
}

interface TrendAnalysisResponse {
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  insights: string[];
  forecast: number[];
  anomalies?: number[]; // Added anomalies detection
}

// New interface for industry-specific insights
interface IndustryInsights {
  industryType: "ecommerce" | "logistics" | "finance";
  metrics: Record<string, number>;
  trends: Record<string, string>;
  risks: { level: "low" | "medium" | "high"; description: string }[];
  opportunities: string[];
}

export const generatePrediction = async (params: PredictionRequest): Promise<PredictionResponse> => {
  try {
    console.log("Generating prediction with params:", params);

    // Simulated API call - replace with actual ML model API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Customize response based on industry type if provided
    let response: PredictionResponse;
    
    if (params.industry === "ecommerce") {
      response = {
        prediction: params.modelType === "regression" ? 
          [120, 145, 160, 180, 200] :
          ["high_intent", "browser", "abandoned_cart", "completed_purchase", "return_customer"],
        confidence: 0.91,
        insights: [
          "Cart abandonment rate is 23% higher on mobile devices",
          "Peak purchasing hours occur between 7-9pm on weekdays",
          "Customers who view 3+ products have 65% higher conversion rate"
        ],
        recommendations: [
          "Implement mobile checkout optimization",
          "Schedule promotions during peak hours",
          "Add related product suggestions"
        ]
      };
    } else if (params.industry === "logistics") {
      response = {
        prediction: params.modelType === "regression" ? 
          [45, 42, 48, 50, 47] :
          ["on_time", "delayed", "at_risk", "on_time", "ahead_of_schedule"],
        confidence: 0.87,
        insights: [
          "Weather conditions affecting 15% of southern route deliveries",
          "Warehouse B processing times improved by 12% this month",
          "Peak congestion occurs on Thursdays between 2-4pm"
        ],
        recommendations: [
          "Reroute southern deliveries through central hub during storm season",
          "Implement Warehouse B processes across other locations",
          "Schedule non-urgent deliveries to avoid peak congestion hours"
        ]
      };
    } else if (params.industry === "finance") {
      response = {
        prediction: params.modelType === "regression" ? 
          [1.2, 1.4, 1.3, 1.5, 1.8] :
          ["low_risk", "medium_risk", "low_risk", "high_risk", "low_risk"],
        confidence: 0.94,
        insights: [
          "Detected unusual transaction pattern in accounts receivable",
          "Cash flow forecast indicates 12% increase next quarter",
          "Expense growth rate outpacing revenue by 3% YoY"
        ],
        recommendations: [
          "Flag accounts receivable anomalies for audit review",
          "Prepare capital allocation plan for projected cash surplus",
          "Review discretionary spending categories with highest growth"
        ]
      };
    } else {
      // Default response when no industry is specified
      response = {
        prediction: params.modelType === "regression" ? 
          [120, 145, 160, 180, 200] :
          ["high", "medium", "low", "high", "medium"],
        confidence: 0.89,
        insights: [
          "Strong correlation detected with seasonal patterns",
          "Key influencing factors identified",
          "Recommendation: Consider external variables"
        ]
      };
    }

    console.log("Prediction response:", response);
    return response;
  } catch (error) {
    console.error("Error generating prediction:", error);
    toast.error("Failed to generate prediction");
    throw error;
  }
};

export const analyzeTrends = async (data: number[], industry?: "ecommerce" | "logistics" | "finance"): Promise<TrendAnalysisResponse> => {
  try {
    console.log("Analyzing trends with data:", data);
    console.log("Industry context:", industry);
    
    // Simple trend analysis logic
    const lastValue = data[data.length - 1];
    const previousValue = data[data.length - 2];
    const trend = lastValue > previousValue ? "increasing" : 
                 lastValue < previousValue ? "decreasing" : "stable";
    
    // Calculate average change
    const changes = data.slice(1).map((val, i) => val - data[i]);
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    // Generate forecast using simple moving average
    const forecast = data.map(val => val * (1 + avgChange / 100));

    // Add anomaly detection
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
    const anomalies = data.map((val, idx) => Math.abs(val - mean) > 2 * stdDev ? idx : -1).filter(idx => idx !== -1);
    
    // Customize insights based on industry
    let insights: string[];
    
    if (industry === "ecommerce") {
      insights = [
        `${trend.charAt(0).toUpperCase() + trend.slice(1)} trend in customer acquisition cost`,
        `Average conversion rate change: ${avgChange.toFixed(2)}%`,
        "Peak shopping periods detected on weekends",
        "Product category performance shows strong seasonal patterns"
      ];
    } else if (industry === "logistics") {
      insights = [
        `${trend.charAt(0).toUpperCase() + trend.slice(1)} trend in delivery efficiency`,
        `Average transit time change: ${avgChange.toFixed(2)}%`,
        "Route optimization potential identified for northern sector",
        "Warehouse capacity utilization approaching optimal levels"
      ];
    } else if (industry === "finance") {
      insights = [
        `${trend.charAt(0).toUpperCase() + trend.slice(1)} trend in financial performance`,
        `Average growth rate: ${avgChange.toFixed(2)}%`,
        "Expense patterns indicate potential for cost optimization",
        "Revenue streams show correlation with market indices"
      ];
    } else {
      insights = [
        `${trend.charAt(0).toUpperCase() + trend.slice(1)} trend detected`,
        `Average change: ${avgChange.toFixed(2)}%`,
        "Consider seasonal variations in analysis"
      ];
    }
    
    return {
      trend,
      confidence: 0.85,
      insights,
      forecast,
      anomalies: anomalies.length > 0 ? anomalies : undefined
    };
  } catch (error) {
    console.error("Error analyzing trends:", error);
    toast.error("Failed to analyze trends");
    throw error;
  }
};

// New function for industry-specific insights
export const getIndustryInsights = async (
  industry: "ecommerce" | "logistics" | "finance",
  data?: Record<string, any>
): Promise<IndustryInsights> => {
  try {
    console.log(`Generating ${industry} insights with data:`, data);
    
    // Simulated API call - replace with actual ML model API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let insights: IndustryInsights;
    
    switch (industry) {
      case "ecommerce":
        insights = {
          industryType: "ecommerce",
          metrics: {
            cartAbandonmentRate: 68.8,
            conversionRate: 3.2,
            averageOrderValue: 78.5,
            customerAcquisitionCost: 28.4,
            returnRate: 12.3
          },
          trends: {
            mobileUsage: "increasing",
            returnCustomers: "stable",
            productBrowsingTime: "increasing",
            checkoutTime: "decreasing"
          },
          risks: [
            { level: "high", description: "Cart abandonment on mobile checkout" },
            { level: "medium", description: "Seasonal inventory management" },
            { level: "low", description: "Payment gateway diversity" }
          ],
          opportunities: [
            "Mobile checkout optimization could improve conversion by 15%",
            "Cross-selling based on browsing patterns shows 24% potential uplift",
            "Peak shopping hours scheduling for marketing campaigns"
          ]
        };
        break;
        
      case "logistics":
        insights = {
          industryType: "logistics",
          metrics: {
            onTimeDeliveryRate: 92.7,
            averageTransitTime: 2.4,
            fuelEfficiency: 8.6,
            warehouseUtilization: 78.2,
            returnProcessingTime: 1.8
          },
          trends: {
            deliverySpeed: "improving",
            routeOptimization: "improving",
            fuelCosts: "increasing",
            customerSatisfaction: "stable"
          },
          risks: [
            { level: "high", description: "Weather disruptions in northern routes" },
            { level: "medium", description: "Warehouse capacity during peak season" },
            { level: "low", description: "Driver availability" }
          ],
          opportunities: [
            "Route optimization could reduce fuel costs by 12%",
            "Predictive maintenance scheduling to reduce vehicle downtime",
            "Real-time tracking improvements for customer satisfaction"
          ]
        };
        break;
        
      case "finance":
        insights = {
          industryType: "finance",
          metrics: {
            returnOnInvestment: 7.8,
            operatingMargin: 18.5,
            cashFlowRatio: 1.2,
            debtToEquity: 0.8,
            assetTurnover: 2.1
          },
          trends: {
            operatingExpenses: "decreasing",
            revenueGrowth: "stable",
            capitalExpenditures: "increasing",
            cashReserves: "increasing"
          },
          risks: [
            { level: "high", description: "Accounts receivable aging in sector B" },
            { level: "medium", description: "Foreign exchange exposure" },
            { level: "low", description: "Compliance costs" }
          ],
          opportunities: [
            "Working capital optimization could free up 8% more cash",
            "Automated reporting to reduce financial close time by 40%",
            "Early payment discounts with key suppliers"
          ]
        };
        break;
    }
    
    return insights;
  } catch (error) {
    console.error(`Error generating ${industry} insights:`, error);
    toast.error(`Failed to generate ${industry} insights`);
    throw error;
  }
};
