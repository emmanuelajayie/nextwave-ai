import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Data from "./pages/Data";
import DataCleaning from "./pages/DataCleaning";
import PredictiveModels from "./pages/PredictiveModels";
import Dashboards from "./pages/Dashboards";
import Settings from "./pages/Settings";
import PaymentCallback from "./pages/payment/Callback";
import { FeedbackDialog } from "./components/feedback/FeedbackDialog";
import { supabase } from "@/lib/supabase";
import IndustryDataProcessing from "./pages/IndustryDataProcessing";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up auth state listener for immediate response to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed in PrivateRoute:", event);
        setSession(currentSession);
        setLoading(false);
      }
    );

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Session data:", data.session ? "Found" : "Not found");
        }
        setSession(data.session);
      } catch (error) {
        console.error("Session fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!session) {
    console.log("No session found, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route
              path="/data"
              element={
                <PrivateRoute>
                  <Data />
                </PrivateRoute>
              }
            />
            <Route
              path="/data-cleaning"
              element={
                <PrivateRoute>
                  <DataCleaning />
                </PrivateRoute>
              }
            />
            <Route
              path="/industry-data-processing"
              element={
                <PrivateRoute>
                  <IndustryDataProcessing />
                </PrivateRoute>
              }
            />
            <Route
              path="/predictive-models"
              element={
                <PrivateRoute>
                  <PredictiveModels />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboards"
              element={
                <PrivateRoute>
                  <Dashboards />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
          <FeedbackDialog />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
