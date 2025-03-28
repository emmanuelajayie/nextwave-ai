
import { Button } from "@/components/ui/button";
import { Plus, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DashboardHeader = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    toast.success(`${newMode ? "Dark" : "Light"} mode enabled`);
  };

  const handleCreateProject = () => {
    // Simple validation
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    // Here you would typically call an API to create the project
    // For now, we'll just show a success message
    toast.success(`New project "${projectName}" created successfully!`);
    
    // Reset form and close sheet
    setProjectName("");
    setProjectDescription("");
    setIsSheetOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground transition-colors">Dashboard</h1>
        <p className="text-muted-foreground mt-1 transition-colors">
          Welcome back! Here's your overview.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="w-10 h-10 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </Button>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Project</SheetTitle>
              <SheetDescription>
                Add a new project to your dashboard. Fill out the details below.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName" 
                  placeholder="Enter project name" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description (Optional)</Label>
                <Input 
                  id="projectDescription" 
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DashboardHeader;
