
import { ModelBuilder } from "@/components/predictive/ModelBuilder";
import { ModelTraining } from "@/components/predictive/ModelTraining";
import { ModelPerformance } from "@/components/predictive/ModelPerformance";
import { ModelTuning } from "@/components/predictive/ModelTuning";
import { ModelInsights } from "@/components/predictive/ModelInsights";
import { ModelDeployment } from "@/components/predictive/ModelDeployment";
import { ScheduledTasks } from "@/components/automation/ScheduledTasks";
import { IndustryInsights } from "@/components/industries/IndustryInsights";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const PredictiveModels = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Log when the component mounts to verify it's being rendered
    console.log("PredictiveModels page mounted");
    
    // Add a small delay to ensure dependent components have time to initialize
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Error boundary at the page level
    try {
      // Additional initialization if needed
    } catch (error) {
      console.error("Error initializing PredictiveModels page:", error);
      setHasError(true);
    }
    
    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
        <p className="mt-2">We encountered an error loading the Predictive Models page.</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Predictive Models</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <ModelBuilder />
          <ModelTraining />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <ModelPerformance />
          <ModelTuning />
        </div>
        <ModelInsights />
        <IndustryInsights />
        <ScheduledTasks />
        <ModelDeployment />
      </div>
    </div>
  );
};

export default PredictiveModels;
