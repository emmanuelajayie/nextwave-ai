
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { CompanyDetailsForm } from "@/components/auth/CompanyDetailsForm";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Auth = () => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [email, setEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Explicitly check for a session on mount to prevent loading flicker
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          setAuthError(error.message);
        } else if (session) {
          console.log("Session found, redirecting to home");
          navigate("/", { replace: true });
        }
      } catch (error: any) {
        console.error("Session check failed:", error);
        setAuthError(error.message);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  // Add auth state change listener
  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        if (event === 'SIGNED_IN' && currentSession) {
          console.log("User signed in, redirecting to home");
          navigate("/", { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authError) {
    toast.error("Authentication error: " + authError);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {!showCompanyDetails ? (
          <AuthForm 
            onSignUpSuccess={(email) => {
              setEmail(email);
              setShowCompanyDetails(true);
            }}
          />
        ) : (
          <CompanyDetailsForm 
            email={email}
            onSuccess={() => {
              setShowCompanyDetails(false);
              toast.success("Registration complete! Please sign in.");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
