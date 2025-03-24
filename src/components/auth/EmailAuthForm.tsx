
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface EmailAuthFormProps {
  isSignUp: boolean;
  onSignUpSuccess: (email: string) => void;
}

export const EmailAuthForm = ({ isSignUp, onSignUpSuccess }: EmailAuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    setLoading(true);

    try {
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (error) throw error;
        
        console.log("Sign up response:", data);
        
        if (data?.user) {
          onSignUpSuccess(email);
          toast.success("Please check your email to verify your account");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        console.log("Sign in response:", data);
        
        if (data?.user) {
          toast.success("Successfully signed in!");
        } else {
          toast.error("Sign in failed. Please check your credentials.");
        }
      }
    } catch (error: any) {
      console.error(`${isSignUp ? 'Sign up' : 'Sign in'} error:`, error);
      
      // Provide more helpful error messages
      if (error.message.includes("Email already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
      </Button>
    </form>
  );
};
