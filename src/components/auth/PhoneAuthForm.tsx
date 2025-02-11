
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const PhoneAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;
      
      setShowVerification(true);
      toast.success("Please check your phone for the verification code");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: verifyCode,
        type: 'sms'
      });

      if (error) throw error;
      
      toast.success("Successfully verified!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showVerification) {
    return (
      <form onSubmit={handlePhoneAuth} className="space-y-4">
        <div>
          <Input
            type="tel"
            placeholder="Phone Number (e.g., +1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Send Code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <InputOTP
          value={verifyCode}
          onChange={(value) => setVerifyCode(value)}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, i) => (
                <InputOTPSlot key={i} {...slot} index={i} />
              ))}
            </InputOTPGroup>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify Code"}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full"
          onClick={() => setShowVerification(false)}
        >
          Back to Phone Input
        </Button>
      </div>
    </form>
  );
};
