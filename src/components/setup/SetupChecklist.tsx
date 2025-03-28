
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

interface Step {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

export const SetupChecklist = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "data",
      title: "Data Collection",
      description: "Import or connect your data sources",
      route: "/data",
      completed: false,
    },
    {
      id: "cleaning",
      title: "Data Cleaning",
      description: "Clean and prepare your data",
      route: "/data-cleaning",
      completed: false,
    },
    {
      id: "models",
      title: "Predictive Models",
      description: "Create and train your models",
      route: "/predictive-models",
      completed: false,
    },
    {
      id: "dashboards",
      title: "Dashboards",
      description: "Set up your visualization dashboards",
      route: "/dashboards",
      completed: false,
    },
  ]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate progress percentage whenever steps change
  useEffect(() => {
    const completedSteps = steps.filter(step => step.completed).length;
    const newProgressPercentage = (completedSteps / steps.length) * 100;
    setProgressPercentage(newProgressPercentage);
  }, [steps]);

  // Load saved progress from local storage on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        // First try to get the steps from localStorage for quick loading
        const savedSteps = localStorage.getItem('setupSteps');
        if (savedSteps) {
          setSteps(JSON.parse(savedSteps));
        }
        
        // Then try to get from database if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('user_setup_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (data && !error) {
            // If we have database data, use it (it's the source of truth)
            const dbSteps = steps.map(step => ({
              ...step,
              completed: data.completed_steps.includes(step.id)
            }));
            setSteps(dbSteps);
            localStorage.setItem('setupSteps', JSON.stringify(dbSteps));
          } else if (!data && savedSteps) {
            // If we have local data but no db data, save local to db
            const completedStepIds = steps
              .filter(step => step.completed)
              .map(step => step.id);
              
            await supabase
              .from('user_setup_progress')
              .upsert({
                user_id: user.id,
                completed_steps: completedStepIds,
                updated_at: new Date().toISOString()
              });
          }
        }
      } catch (error) {
        console.error("Error loading setup progress:", error);
        // Still use localStorage as fallback if database fails
        const savedSteps = localStorage.getItem('setupSteps');
        if (savedSteps) {
          setSteps(JSON.parse(savedSteps));
        }
      }
    };

    loadSavedProgress();
  }, []);

  const saveProgress = async (updatedSteps: Step[]) => {
    // Always save to localStorage first for quick access
    localStorage.setItem('setupSteps', JSON.stringify(updatedSteps));
    
    try {
      // Then try to save to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const completedStepIds = updatedSteps
          .filter(step => step.completed)
          .map(step => step.id);
          
        await supabase
          .from('user_setup_progress')
          .upsert({
            user_id: user.id,
            completed_steps: completedStepIds,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error("Error saving setup progress:", error);
      // We already saved to localStorage so the UI will still update
    }
  };

  const handleStepClick = (route: string, index: number) => {
    navigate(route);
    
    // Mark previous steps as completed when moving forward
    const updatedSteps = steps.map((step, i) => ({
      ...step,
      completed: i < index ? true : step.completed,
    }));
    
    setSteps(updatedSteps);
    saveProgress(updatedSteps);
    toast.success("You can always come back to complete skipped steps later");
  };

  const markStepComplete = async (index: number) => {
    setIsLoading(true);
    
    try {
      // Simulate a delay to show button loading state
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedSteps = steps.map((step, i) =>
        i === index ? { ...step, completed: true } : step
      );
      
      setSteps(updatedSteps);
      await saveProgress(updatedSteps);
      toast.success(`${steps[index].title} marked as complete!`);
    } catch (error) {
      console.error("Error marking step complete:", error);
      toast.error("Failed to update progress. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Setup Progress</h2>
        <span className="text-sm text-muted-foreground">
          {steps.filter(step => step.completed).length}/{steps.length} completed
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-6" />
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => markStepComplete(index)}
                disabled={step.completed || isLoading}
                className={step.completed ? "text-green-500" : ""}
              >
                {step.completed ? "Completed" : "Mark Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStepClick(step.route, index)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
