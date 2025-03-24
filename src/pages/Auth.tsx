
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { CompanyDetailsForm } from "@/components/auth/CompanyDetailsForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Auth = () => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [email, setEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Improved session handling with more reliable initialization
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          setAuthError(error.message);
          return null;
        }
        return session;
      } catch (error: any) {
        console.error("Session fetch error:", error);
        setAuthError(error.message);
        return null;
      } finally {
        setAuthLoading(false);
      }
    },
  });

  // Add auth state change listener with logging and navigation
  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        if (event === 'SIGNED_IN' && currentSession) {
          console.log("User signed in, redirecting to home");
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authError) {
    toast.error("Authentication error: " + authError);
  }

  if (session) {
    console.log("Session found, redirecting to home page");
    return <Navigate to="/" replace />;
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
