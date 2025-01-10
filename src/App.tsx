import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Data from "./pages/Data";
import DataCleaning from "./pages/DataCleaning";
import PredictiveModels from "./pages/PredictiveModels";
import Dashboards from "./pages/Dashboards";
import Settings from "./pages/Settings";
import { AuthForm } from "./components/auth/AuthForm";
import { OnboardingFlow } from "./components/auth/OnboardingFlow";
import { UserProfile } from "./components/auth/UserProfile";
import { FeedbackDialog } from "./components/feedback/FeedbackDialog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingFlow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data"
              element={
                <ProtectedRoute>
                  <Data />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-cleaning"
              element={
                <ProtectedRoute>
                  <DataCleaning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predictive-models"
              element={
                <ProtectedRoute>
                  <PredictiveModels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboards"
              element={
                <ProtectedRoute>
                  <Dashboards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
          <FeedbackDialog />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;