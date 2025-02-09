
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaymentService } from "@/lib/payment";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("tx_ref");
        if (!reference) {
          throw new Error("No transaction reference found");
        }

        const payment = await PaymentService.verifyPayment(reference);
        
        if (payment.status === "successful") {
          setStatus("success");
          toast.success("Payment successful!");
        } else {
          setStatus("error");
          toast.error("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("error");
        toast.error("Failed to verify payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          {verifying ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-lg">Verifying your payment...</p>
            </div>
          ) : status === "success" ? (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
              <p>Thank you for your payment.</p>
              <Button onClick={() => navigate("/")}>Return to Home</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
              <p>Something went wrong with your payment.</p>
              <Button onClick={() => navigate("/")}>Try Again</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentCallback;
