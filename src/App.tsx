
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Data from "./pages/Data";
import DataCleaning from "./pages/DataCleaning";
import PredictiveModels from "./pages/PredictiveModels";
import Dashboards from "./pages/Dashboards";
import Settings from "./pages/Settings";
import PaymentCallback from "./pages/payment/Callback";
import { FeedbackDialog } from "./components/feedback/FeedbackDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const App = () => (
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
        </Routes>
        <FeedbackDialog />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
