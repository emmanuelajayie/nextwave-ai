
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EcommerceInsights } from "./EcommerceInsights";
import { LogisticsInsights } from "./LogisticsInsights";
import { FinanceInsights } from "./FinanceInsights";
import { TechInsights } from "./TechInsights";
import { RealEstateInsights } from "./RealEstateInsights";
import { DataSeeder } from "../data/DataSeeder";
import { ShoppingCart, Truck, LineChart, Laptop, Building, Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

// Fallback component for error states
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <h3 className="text-lg font-medium text-red-800">Something went wrong with this insight</h3>
      <p className="text-sm text-red-600 mt-1">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  );
};

// Safe wrapper for each insight component
const SafeInsightWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the component state here if needed
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export const IndustryInsights = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<"ecommerce" | "logistics" | "finance" | "tech" | "realestate">("ecommerce");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    // Simulate loading time for tab change
    setTimeout(() => {
      setSelectedIndustry(value as "ecommerce" | "logistics" | "finance" | "tech" | "realestate");
      setIsLoading(false);
    }, 300);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Industry-Specific Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize insights based on your industry
          </p>
        </div>
        <DataSeeder />
      </div>

      <Tabs 
        defaultValue="ecommerce" 
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="ecommerce" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            E-commerce
          </TabsTrigger>
          <TabsTrigger value="logistics" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Logistics
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Finance
          </TabsTrigger>
          <TabsTrigger value="tech" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            Tech
          </TabsTrigger>
          <TabsTrigger value="realestate" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Real Estate
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="ecommerce">
              <SafeInsightWrapper>
                <EcommerceInsights />
              </SafeInsightWrapper>
            </TabsContent>
            
            <TabsContent value="logistics">
              <SafeInsightWrapper>
                <LogisticsInsights />
              </SafeInsightWrapper>
            </TabsContent>
            
            <TabsContent value="finance">
              <SafeInsightWrapper>
                <FinanceInsights />
              </SafeInsightWrapper>
            </TabsContent>

            <TabsContent value="tech">
              <SafeInsightWrapper>
                <TechInsights />
              </SafeInsightWrapper>
            </TabsContent>

            <TabsContent value="realestate">
              <SafeInsightWrapper>
                <RealEstateInsights />
              </SafeInsightWrapper>
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  );
};
