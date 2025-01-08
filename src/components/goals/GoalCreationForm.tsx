import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const GoalCreationForm = () => {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [metric, setMetric] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [type, setType] = useState<"increase" | "decrease">("increase");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new goal:", { title, target, metric, timeframe, type });
    toast.success("New goal created successfully!");
    
    // Reset form
    setTitle("");
    setTarget("");
    setMetric("");
    setTimeframe("");
    setType("increase");
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Goal Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Increase Monthly Revenue"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Value</Label>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g., 100000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metric">Metric</Label>
            <Input
              id="metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="e.g., USD, Users, %"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Goal Type</Label>
            <Select value={type} onValueChange={(value: "increase" | "decrease") => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">Increase</SelectItem>
                <SelectItem value="decrease">Decrease</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Input
              id="timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="e.g., Q4 2024"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Goal
        </Button>
      </form>
    </Card>
  );
};