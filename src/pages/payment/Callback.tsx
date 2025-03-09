
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaymentService } from "@/lib/payment";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("tx_ref");
        if (!reference) {
          throw new Error("No transaction reference found");
        }

        console.log("Verifying payment reference:", reference);
        const { payment, status: paymentStatus, message } = await PaymentService.verifyPayment(reference);
        
        if (paymentStatus === "successful") {
          setStatus("success");
          setPaymentData(payment);
          toast.success(message || "Payment successful!");
          
          // If this was a subscription payment, update UI accordingly
          if (payment?.payment_type === "subscription") {
            // Update subscription status to active if it was a subscription payment
            if (payment.plan_id) {
              const { error } = await supabase
                .from("payments")
                .update({ 
                  subscription_status: "active",
                  updated_at: new Date().toISOString()
                })
                .eq("id", payment.id);
              
              if (error) {
                console.error("Error updating subscription status:", error);
              } else {
                toast.success("Your subscription is now active!");
              }
            }
          }
        } else {
          setStatus("error");
          setErrorMessage(message || "Payment verification failed");
          toast.error(message || "Payment failed. Please try again.");
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        setStatus("error");
        setErrorMessage(error.message || "Failed to verify payment");
        toast.error("Failed to verify payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center space-y-6">
            {verifying ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <p className="text-lg">Verifying your payment...</p>
              </div>
            ) : status === "success" ? (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
                <p className="text-gray-600">
                  {paymentData?.payment_type === "subscription" 
                    ? "Your subscription is now active." 
                    : "Thank you for your payment."}
                </p>
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
                <p className="text-gray-600">{errorMessage}</p>
                <div className="space-y-2">
                  <Button 
                    variant="default"
                    onClick={() => navigate("/pricing")}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="w-full"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PaymentCallback;
