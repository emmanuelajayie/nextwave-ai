
export interface IndustryInsights {
  metrics: {
    [key: string]: number;
  };
  trends: {
    [key: string]: string;
  };
  insights: {
    userBehavior?: string[];
    predictive?: string[];
    market?: string[];
    leadScoring?: string[];
    [key: string]: string[] | undefined;
  };
}

export const getIndustryInsights = async (
  industry: "ecommerce" | "logistics" | "finance" | "tech" | "realestate"
): Promise<IndustryInsights> => {
  // E-commerce industry mock data
  if (industry === "ecommerce") {
    return {
      metrics: {
        conversionRate: 2.5,
        averageOrderValue: 75.20,
        customerAcquisitionCost: 45.00,
        customerLifetimeValue: 350.50,
        cartAbandonmentRate: 65.3,
        returnRate: 8.2
      },
      trends: {
        conversionRate: "Up 0.3% from last month",
        averageOrderValue: "Increased by $5.15",
        customerAcquisitionCost: "Decreased by $2.50",
        returnRate: "Down 1.1% from previous quarter"
      },
      insights: {
        userBehavior: [
          "Mobile users convert at 1.8x the rate of desktop users",
          "Personalized product recommendations increase order value by 15%",
          "Customers acquired through social media have a 20% higher lifetime value",
          "Offering free shipping on orders over $50 reduces cart abandonment by 10%"
        ],
        predictive: [
          "Customers who view more than 5 products are 30% more likely to purchase",
          "Offering discounts to customers who abandon their cart within 1 hour increases conversion by 25%",
          "Customers who have made a purchase in the last 30 days are 40% more likely to purchase again",
          "Customers who have left a positive review are 50% more likely to refer a friend"
        ]
      }
    };
  }

  // Logistics industry mock data
  if (industry === "logistics") {
    return {
      metrics: {
        onTimeDeliveryRate: 92.4,
        averageTransitTime: 3.2,
        customerSatisfactionScore: 4.6,
        warehouseUtilization: 85.1,
        fuelEfficiency: 12.5,
        returnProcessingTime: 2.1
      },
      trends: {
        onTimeDeliveryRate: "Up 0.7% from last month",
        averageTransitTime: "Decreased by 0.2 days",
        customerSatisfactionScore: "Increased by 0.1 points",
        fuelEfficiency: "Improved by 0.5 MPG"
      },
      insights: {
        userBehavior: [
          "Customers who track their shipments are 2x more likely to be satisfied",
          "Customers who receive proactive updates are 3x more likely to be satisfied",
          "Customers who use the mobile app are 4x more likely to be satisfied",
          "Customers who use the self-service portal are 5x more likely to be satisfied"
        ],
        predictive: [
          "Shipments with a high risk of delay are 6x more likely to be delayed",
          "Shipments with a high risk of damage are 7x more likely to be damaged",
          "Shipments with a high risk of loss are 8x more likely to be lost",
          "Shipments with a high risk of theft are 9x more likely to be stolen"
        ]
      }
    };
  }

  // Finance industry mock data
  if (industry === "finance") {
    return {
      metrics: {
        customerAcquisitionCost: 150.00,
        customerLifetimeValue: 1500.00,
        netPromoterScore: 45.00,
        customerChurnRate: 5.00,
        customerSatisfactionScore: 4.2,
        averageRevenuePerUser: 50.00
      },
      trends: {
        customerAcquisitionCost: "Decreased by $10.00",
        customerLifetimeValue: "Increased by $50.00",
        netPromoterScore: "Increased by 2 points",
        customerChurnRate: "Decreased by 0.5%",
        averageRevenuePerUser: "Increased by $2.00"
      },
      insights: {
        userBehavior: [
          "Customers who use the mobile app are 10x more likely to be satisfied",
          "Customers who use the self-service portal are 11x more likely to be satisfied",
          "Customers who use the online chat are 12x more likely to be satisfied",
          "Customers who use the phone are 13x more likely to be satisfied"
        ],
        predictive: [
          "Customers with a high risk of churn are 14x more likely to churn",
          "Customers with a high risk of default are 15x more likely to default",
          "Customers with a high risk of fraud are 16x more likely to commit fraud",
          "Customers with a high risk of money laundering are 17x more likely to launder money"
        ]
      }
    };
  }

  // Tech industry mock data
  if (industry === "tech") {
    return {
      metrics: {
        userEngagementRate: 78.5,
        featureAdoptionRate: 62.3,
        churnRate: 5.7,
        growthRate: 15.2,
        activeUsers: 12540,
        retentionRate: 85.4,
        securityScore: 92.1
      },
      trends: {
        userEngagement: "Up 3.2% from last month",
        featureAdoption: "Increasing steadily at 4.1% monthly",
        churn: "Down 0.5% from previous quarter",
        security: "Improved by 2.1% with latest updates"
      },
      insights: {
        userBehavior: [
          "Users spend most time on analytics dashboards",
          "Feature usage peaks during weekday mornings",
          "Mobile usage has increased by 18% this quarter",
          "New users typically explore 60% of features in first week"
        ],
        predictive: [
          "Churn risk highest for users inactive for 14+ days",
          "Feature adoption rate correlates with retention",
          "Users with customized dashboards show 35% higher engagement",
          "Growth trajectory indicates 22% user increase by Q4"
        ]
      }
    };
  }

  // Real estate industry mock data
  if (industry === "realestate") {
    return {
      metrics: {
        marketAnalysisScore: 87.3,
        propertyValuationChange: 12.4,
        leadConversionRate: 23.6,
        investmentPotentialScore: 76.8,
        listingViewsRate: 2450,
        securityComplianceScore: 94.7
      },
      trends: {
        marketAnalysis: "Market demand up 7.2% in metro areas",
        propertyValuation: "Appreciating at 3.1% quarterly",
        leadConversion: "Improved by 5.4% with new scoring system",
        security: "Compliance score stable with 1.2% improvement"
      },
      insights: {
        market: [
          "Urban properties outperforming suburban by 14%",
          "Commercial spaces seeing increased demand post-pandemic",
          "Rental yields highest in university-adjacent areas",
          "Green-certified buildings command 8% price premium"
        ],
        leadScoring: [
          "Leads with prior property history convert 45% better",
          "Digital engagement correlates with 67% higher close rate",
          "First-time buyers require 3x more touchpoints",
          "Referral leads close at 2.8x the rate of cold leads"
        ]
      }
    };
  }

  return {
    metrics: {
      conversionRate: 0,
      averageOrderValue: 0,
      customerAcquisitionCost: 0,
      customerLifetimeValue: 0,
      cartAbandonmentRate: 0,
      returnRate: 0
    },
    trends: {
      conversionRate: "",
      averageOrderValue: "",
      customerAcquisitionCost: "",
      returnRate: ""
    },
    insights: {
      userBehavior: [],
      predictive: []
    }
  };
};

// Add the missing analyzeTrends function
export interface TrendAnalysisResult {
  trend: string;
  insights: string[];
  anomalies?: number[];
}

export const analyzeTrends = async (
  data: number[],
  industry: string
): Promise<TrendAnalysisResult> => {
  // This is a mock implementation for the analyzeTrends function
  // In a real application, this would use AI algorithms to analyze the data
  
  // Calculate simple trend direction
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  let trendDirection = "stable";
  if (secondHalfAvg > firstHalfAvg * 1.05) {
    trendDirection = "increasing";
  } else if (secondHalfAvg < firstHalfAvg * 0.95) {
    trendDirection = "decreasing";
  }
  
  // Detect simple anomalies - values that are significantly different from the mean
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const stdDev = Math.sqrt(
    data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  );
  
  const anomalies = data
    .map((val, idx) => (Math.abs(val - mean) > stdDev * 2 ? idx : -1))
    .filter(idx => idx !== -1);
  
  // Generate mock insights based on industry and trend
  let insights: string[] = [];
  
  if (industry === "ecommerce") {
    insights = [
      `Sales volume is ${trendDirection} over the analysis period.`,
      "Customer engagement peaks on weekends.",
      "Product categories showing highest growth: electronics, home goods.",
      "Recommended action: Optimize inventory levels based on predicted demand."
    ];
  } else if (industry === "logistics") {
    insights = [
      `Delivery efficiency is ${trendDirection} over the analysis period.`,
      "Peak delivery times occur during mid-month.",
      "Routes with highest optimization potential: urban centers, express delivery.",
      "Recommended action: Adjust staffing during peak periods."
    ];
  } else if (industry === "finance") {
    insights = [
      `Transaction volume is ${trendDirection} over the analysis period.`,
      "Customer acquisition cost remains stable.",
      "Highest growth products: investment accounts, premium cards.",
      "Recommended action: Target retention offers to high-value segments."
    ];
  } else if (industry === "tech") {
    insights = [
      `User engagement is ${trendDirection} over the analysis period.`,
      "Feature adoption is strongest in mobile applications.",
      "User retention shows correlation with onboarding completion.",
      "Recommended action: Optimize onboarding flow and feature discovery."
    ];
  } else if (industry === "realestate") {
    insights = [
      `Property interest is ${trendDirection} over the analysis period.`,
      "Listing views peak during weekends and early evenings.",
      "Highest performing properties: urban condos, suburban family homes.",
      "Recommended action: Adjust pricing strategy based on demand patterns."
    ];
  } else {
    insights = [
      `Overall performance is ${trendDirection} over the analysis period.`,
      "Key metrics remain within expected ranges.",
      "Several opportunities for optimization identified.",
      "Recommended action: Review detailed analysis for specific recommendations."
    ];
  }
  
  return {
    trend: `The data shows a ${trendDirection} trend over the analyzed period.`,
    insights,
    anomalies: anomalies.length > 0 ? anomalies : undefined
  };
};
