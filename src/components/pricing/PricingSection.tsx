import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const plans = {
  basic: {
    title: "Basic Plan",
    description: "Contact us for custom pricing",
    price: "Custom",
    features: [
      { text: "Basic data analysis", included: true },
      { text: "Up to 1,000 records/month", included: true },
      { text: "Email support", included: true },
      { text: "Custom integrations", included: false },
      { text: "Advanced analytics", included: false },
    ],
  },
  standard: {
    title: "Standard Plan",
    description: "Contact us for custom pricing",
    price: "Custom",
    features: [
      { text: "Advanced data analysis", included: true },
      { text: "Up to 10,000 records/month", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Advanced analytics", included: false },
    ],
    popular: true,
  },
  premium: {
    title: "Enterprise Plan",
    description: "Contact us for custom pricing",
    price: "Custom",
    features: [
      { text: "Enterprise data analysis", included: true },
      { text: "Unlimited records", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Advanced analytics", included: true },
    ],
  },
};

export const PricingSection = () => {
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (planType: keyof typeof plans) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to continue");
        return;
      }

      // Contact form or redirect to contact page
      toast.info("Please contact our sales team for custom pricing");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs. Contact us for custom pricing.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <PricingCard
          {...plans.basic}
          onSelect={() => handleSelectPlan("basic")}
        />
        <PricingCard
          {...plans.standard}
          onSelect={() => handleSelectPlan("standard")}
        />
        <PricingCard
          {...plans.premium}
          onSelect={() => handleSelectPlan("premium")}
        />
      </div>
    </section>
  );
};