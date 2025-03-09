
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { PaymentService } from "@/lib/payment";
import { toast } from "sonner";
import { addDays, isBefore } from "date-fns";

export const SubscriptionAlert = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch user's payment status
  const { data: payment, isLoading: paymentLoading } = useQuery({
    queryKey: ["payment-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return data;
    },
  });

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscription_plans")
        .select("*");
      return data;
    },
  });

  // Determine if trial has expired
  const isTrialExpired = () => {
    if (!payment || !payment.trial_end_date) return false;
    
    const trialEndDate = new Date(payment.trial_end_date);
    return isBefore(trialEndDate, new Date());
  };

  // Check if user needs to subscribe
  const needsSubscription = !paymentLoading && payment && 
    payment.subscription_status !== "active" && isTrialExpired();

  useEffect(() => {
    // Auto-open dialog if trial is expired and not already subscribed
    if (needsSubscription) {
      setShowDialog(true);
    }
  }, [payment, paymentLoading]);

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue");
      return;
    }

    try {
      setIsProcessing(true);
      const selectedPlanDetails = plans?.find(plan => plan.id === selectedPlan);
      
      if (!selectedPlanDetails) {
        toast.error("Selected plan not found");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to subscribe");
        return;
      }

      // Initialize payment via PaymentService
      const { url } = await PaymentService.createPayment({
        amount: selectedPlanDetails.price,
        currency: "NGN",
        payment_type: "subscription",
        customer: { email: user.email || "" },
        metadata: { plan_name: selectedPlanDetails.name },
        plan_id: selectedPlanDetails.id
      });

      // Redirect to payment page
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription request");
    } finally {
      setIsProcessing(false);
    }
  };

  // No need to show anything if still loading or no payment data yet
  if (paymentLoading || !payment) return null;

  // If subscription active, don't show anything
  if (payment.subscription_status === "active") return null;

  // Trial active but not expired - show informational banner
  if (payment.subscription_status === "trial" && !isTrialExpired()) {
    const trialEndDate = new Date(payment.trial_end_date);
    const daysLeft = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <Alert className="mb-4 border-yellow-500 bg-yellow-50">
        <AlertTitle className="text-yellow-800">Trial Period Active</AlertTitle>
        <AlertDescription className="text-yellow-700">
          You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your trial period.
          <Button 
            variant="link" 
            className="p-0 text-yellow-800 font-semibold underline ml-2"
            onClick={() => setShowDialog(true)}
          >
            Choose a subscription
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // When trial expired or user has no active subscription - show warning banner
  const trialEnded = payment.subscription_status === "trial" && isTrialExpired();
  const alertTitle = trialEnded ? "Trial Period Ended" : "Subscription Required";
  
  return (
    <>
      <Alert className="mb-4 border-red-500 bg-red-50">
        <AlertTitle className="text-red-800">{alertTitle}</AlertTitle>
        <AlertDescription className="text-red-700 flex justify-between items-center">
          <div>
            {trialEnded 
              ? "Your trial period has ended. Please subscribe to continue using the platform." 
              : "A subscription is required to use this platform."}
          </div>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowDialog(true)}
          >
            Subscribe Now
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose a Subscription Plan</DialogTitle>
            <DialogDescription>
              Select a subscription plan to continue using all platform features.
            </DialogDescription>
          </DialogHeader>
          
          {plansLoading ? (
            <div className="py-4 text-center">Loading subscription plans...</div>
          ) : plans && plans.length > 0 ? (
            <div className="grid gap-4 py-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-4 cursor-pointer ${selectedPlan === plan.id ? 'border-primary ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-lg font-bold">₦{plan.price.toLocaleString()}</div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No subscription plans available</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubscribe} 
              disabled={!selectedPlan || isProcessing}
            >
              {isProcessing ? "Processing..." : "Subscribe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
