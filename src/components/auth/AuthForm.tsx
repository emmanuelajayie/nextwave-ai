import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Temporarily disabled Supabase auth
      toast.info("Authentication is currently disabled. Please try again later.");
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication is currently unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <form onSubmit={handleAuth} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isResetPassword ? "Reset Password" : isSignUp ? "Create Account" : "Login"}
        </h2>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {!isResetPassword && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : isResetPassword ? (
            "Send Reset Instructions"
          ) : isSignUp ? (
            "Sign Up"
          ) : (
            "Login"
          )}
        </Button>

        <div className="flex justify-between text-sm">
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setIsResetPassword(false);
            }}
          >
            {isSignUp ? "Already have an account?" : "Need an account?"}
          </Button>
          {!isResetPassword && (
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsResetPassword(true);
                setIsSignUp(false);
              }}
            >
              Forgot password?
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};