import { GoalCard } from "./GoalCard";
import { GoalInsights } from "./GoalInsights";
import { GoalCreationForm } from "./GoalCreationForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample data - in a real app, this would come from an API
const sampleGoals = [
  {
    id: "1",
    title: "Increase Monthly Revenue",
    target: 100000,
    current: 75000,
    type: "increase" as const,
    metric: "USD",
    timeframe: "Q4 2024",
  },
  {
    id: "2",
    title: "Reduce Customer Churn",
    target: 5,
    current: 8,
    type: "decrease" as const,
    metric: "%",
    timeframe: "Q4 2024",
  },
  {
    id: "3",
    title: "Improve Customer Satisfaction",
    target: 90,
    current: 85,
    type: "increase" as const,
    metric: "%",
    timeframe: "Q4 2024",
  },
];

const sampleInsights = [
  {
    type: "success" as const,
    message: "Revenue growth is on track to exceed target by 15% based on current trajectory",
  },
  {
    type: "warning" as const,
    message: "Customer churn rate has increased by 2% in the last month",
  },
  {
    type: "info" as const,
    message: "Consider implementing a customer loyalty program to improve retention",
  },
];

export const GoalsOverview = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Business Goals</h2>
          <p className="text-muted-foreground">Track and manage your business objectives</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <GoalCreationForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      <GoalInsights insights={sampleInsights} />
    </div>
  );
};