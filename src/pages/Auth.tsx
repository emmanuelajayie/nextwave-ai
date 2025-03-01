
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { CompanyDetailsForm } from "@/components/auth/CompanyDetailsForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [email, setEmail] = useState("");

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  if (session) {
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
            onSuccess={() => setShowCompanyDetails(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
