import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your overview.</p>
      </div>
      <Button className="bg-primary hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        New Project
      </Button>
    </div>
  );
};

export default DashboardHeader;