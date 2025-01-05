import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { DashboardTemplates } from "@/components/dashboard/DashboardTemplates";
import { CustomizableWidgets } from "@/components/dashboard/CustomizableWidgets";
import InsightsSection from "@/components/dashboard/InsightsSection";
import { toast } from "sonner";

const Dashboards = () => {
  const handleExport = () => {
    console.log("Exporting dashboard as PDF");
    toast.success("Dashboard exported successfully");
  };

  const handleShare = () => {
    console.log("Generating public share link");
    toast.success("Share link copied to clipboard");
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Interactive Dashboards
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Visualize and analyze your data insights
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <DashboardTemplates />
        <CustomizableWidgets />
        <InsightsSection />
      </div>
    </MainLayout>
  );
};

export default Dashboards;