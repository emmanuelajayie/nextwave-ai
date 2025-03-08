
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Database, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [industry, setIndustry] = useState<"all" | "finance" | "ecommerce" | "logistics" | "tech" | "realestate">("all");

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      
      // Get session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to seed data");
        return;
      }
      
      // Call the seed-data edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ industry })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to seed data");
      }
      
      toast.success(`Successfully seeded ${industry} data`);
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Failed to seed data: " + error.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Industry to Seed</label>
          <Select 
            value={industry}
            onValueChange={(value: "all" | "finance" | "ecommerce" | "logistics" | "tech" | "realestate") => setIndustry(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="realestate">Real Estate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleSeedData}
          disabled={isSeeding}
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Sample Data...
            </>
          ) : (
            'Generate Sample Data'
          )}
        </Button>
      </div>
    </div>
  );
};
