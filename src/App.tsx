import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Data from "./pages/Data";
import DataCleaning from "./pages/DataCleaning";
import PredictiveModels from "./pages/PredictiveModels";
import Dashboards from "./pages/Dashboards";
import Settings from "./pages/Settings";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data" element={<Data />} />
          <Route path="/data-cleaning" element={<DataCleaning />} />
          <Route path="/predictive-models" element={<PredictiveModels />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <FeedbackDialog />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;