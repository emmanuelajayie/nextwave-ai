
import { PaymentDetails, Payment } from "@/types/payment";
import { supabase } from "@/lib/supabase";
import { addDays } from "date-fns";

export class PaymentService {
  private static async initializeTransaction(details: PaymentDetails): Promise<{ url: string; reference: string }> {
    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment");
      }

      return response.json();
    } catch (error) {
      console.error("Payment initialization error:", error);
      throw error;
    }
  }

  static async createPayment(details: PaymentDetails): Promise<{ url: string; reference: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to make payments");
    }

    // Initialize the transaction with Flutterwave
    const { url, reference } = await this.initializeTransaction(details);

    // Create a record in our payments table
    const { error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        transaction_ref: reference,
        amount: details.amount,
        currency: details.currency,
        payment_type: details.payment_type,
        metadata: details.metadata,
        business_type: details.business_type,
        plan_id: details.plan_id,
        trial_end_date: details.payment_type === 'subscription' ? addDays(new Date(), 7) : null,
        subscription_status: details.payment_type === 'subscription' ? 'trial' : 'inactive'
      });

    if (error) {
      console.error("Error creating payment record:", error);
      throw error;
    }

    return { url, reference };
  }

  static async verifyPayment(reference: string): Promise<{ payment: Payment; status: string; message: string }> {
    try {
      const response = await fetch(`/api/payment/verify/${reference}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to verify payment");
      }

      const result = await response.json();
      return {
        payment: result.data,
        status: result.status,
        message: result.message
      };
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  }
}
