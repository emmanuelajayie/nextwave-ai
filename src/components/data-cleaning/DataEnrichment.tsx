import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const enrichmentTypes = [
  {
    value: "demographics",
    label: "Demographics",
    description: "Age, income, education level",
  },
  {
    value: "industry",
    label: "Industry Benchmarks",
    description: "Market averages, competitor metrics",
  },
  {
    value: "location",
    label: "Location Data",
    description: "Geographic and regional information",
  },
];

export const DataEnrichment = () => {
  const [loading, setLoading] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string>("");

  const enrichData = async () => {
    if (!selectedType) {
      toast.error("Please select an enrichment type");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting data enrichment for type:", selectedType);
      
      // Simulated data for demonstration
      const sampleData = [
        { id: 1, name: "John Smith", email: "john@example.com" },
        { id: 2, name: "Jane Doe", email: "jane@example.com" },
      ];

      const { data, error } = await supabase.functions.invoke("enrich-data", {
        body: { data: sampleData, enrichmentType: selectedType },
      });

      if (error) throw error;

      console.log("Enrichment completed:", data);
      toast.success("Data enriched successfully!");
    } catch (error) {
      console.error("Error enriching data:", error);
      toast.error("Failed to enrich data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">AI Data Enrichment</h3>
            <p className="text-sm text-muted-foreground">
              Automatically enhance your dataset with AI-powered insights
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-blue-500" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enrichment Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type of enrichment" />
              </SelectTrigger>
              <SelectContent>
                {enrichmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={enrichData}
            disabled={loading || !selectedType}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enriching Data...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Enrich Data
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};