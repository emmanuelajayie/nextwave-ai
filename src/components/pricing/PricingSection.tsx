import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const plans = {
  basic: {
    title: "Basic Plan",
    description: "Perfect for small businesses",
    price: "$200/month",
    setupFee: "$500",
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
    description: "Ideal for growing companies",
    price: "$600/month",
    setupFee: "$3,000",
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
    title: "Premium Plan",
    description: "For enterprise-level needs",
    price: "$2,000/month",
    setupFee: "$10,000",
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
      const plan = plans[planType];
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to subscribe to a plan");
        return;
      }

      // Initialize Paystack payment
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planType,
          email: user.email,
          amount: parseInt(plan.price.replace(/[^0-9]/g, "")) * 100, // Convert to lowest currency unit
          setupFee: parseInt(plan.setupFee.replace(/[^0-9]/g, "")) * 100,
        }),
      });

      const { authorization_url } = await response.json();
      
      // Redirect to Paystack checkout
      window.location.href = authorization_url;
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs. All plans include a one-time setup fee.
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