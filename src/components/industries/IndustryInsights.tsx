
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

export const IndustryInsights = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<"ecommerce" | "logistics" | "finance" | "tech" | "realestate">("ecommerce");

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
        onValueChange={(value) => setSelectedIndustry(value as "ecommerce" | "logistics" | "finance" | "tech" | "realestate")}
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
        
        <TabsContent value="ecommerce">
          <EcommerceInsights />
        </TabsContent>
        
        <TabsContent value="logistics">
          <LogisticsInsights />
        </TabsContent>
        
        <TabsContent value="finance">
          <FinanceInsights />
        </TabsContent>

        <TabsContent value="tech">
          <TechInsights />
        </TabsContent>

        <TabsContent value="realestate">
          <RealEstateInsights />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
