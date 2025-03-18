
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BusinessType } from "@/types/payment";
import { supabase } from "@/lib/supabase";
import { Building, Building2 } from "lucide-react";

const businessTypeInfo = {
  small: {
    title: "Small Business",
    icon: Building,
    description: "Perfect for small teams and startups",
  },
  medium: {
    title: "Mid-Sized Business",
    icon: Building2,
    description: "Ideal for growing companies",
  },
  enterprise: {
    title: "Enterprise",
    icon: Building,
    description: "For large organizations with complex needs",
  },
};

export const BusinessTypeSelect = () => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<BusinessType | null>(null);

  const handleSelectBusinessType = async (type: BusinessType) => {
    try {
      setLoading(true);
      setSelectedType(type);
      
      const { data: setupFee, error } = await supabase
        .from("setup_fees")
        .select("*")
        .eq("business_type", type)
        .single();

      if (error) {
        console.error("Error fetching setup fee:", error);
        toast.error("Failed to retrieve payment information. Please try again.");
        return;
      }

      if (!setupFee) {
        toast.error("Payment information not found for this business type.");
        return;
      }

      // Redirect to payment link
      window.location.href = setupFee.payment_link;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-8">
      <h2 className="text-2xl font-bold text-center mb-2">Select Your Business Type</h2>
      <p className="text-center text-muted-foreground mb-6">This is a one-time setup fee. Monthly subscription options will be available after setup.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(businessTypeInfo) as BusinessType[]).map((type) => {
          const { title, icon: Icon, description } = businessTypeInfo[type];
          return (
            <Card key={type} className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Icon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
                <Button
                  onClick={() => handleSelectBusinessType(type)}
                  disabled={loading && selectedType === type}
                  className="w-full"
                >
                  {loading && selectedType === type ? "Processing..." : "Select & Continue"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
