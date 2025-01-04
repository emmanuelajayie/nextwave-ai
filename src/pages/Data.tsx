import MainLayout from "@/components/layout/MainLayout";
import { DataImport } from "@/components/data/DataImport";
import { DataSources } from "@/components/data/DataSources";
import { DataPreview } from "@/components/data/DataPreview";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Data = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Data Collection
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Import and manage your data sources
          </p>
        </div>

        <DataImport />
        <DataSources />
        <DataPreview />

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            Proceed to Data Cleaning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Data;