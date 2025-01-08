import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Target } from "lucide-react";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    target: number;
    current: number;
    type: "increase" | "decrease";
    metric: string;
    timeframe: string;
  };
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const progress = (goal.current / goal.target) * 100;
  const isPositiveProgress = goal.type === "increase" ? progress >= 0 : progress <= 0;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{goal.title}</h3>
          <p className="text-sm text-muted-foreground">{goal.timeframe}</p>
        </div>
        <Badge variant={isPositiveProgress ? "default" : "destructive"}>
          {goal.type === "increase" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {goal.metric}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="pt-2 flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Current</p>
          <p className="font-medium">{goal.current}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Target</p>
          <p className="font-medium">{goal.target}</p>
        </div>
      </div>
    </Card>
  );
};