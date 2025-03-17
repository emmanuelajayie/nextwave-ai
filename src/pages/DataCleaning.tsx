
import MainLayout from "@/components/layout/MainLayout";
import { DataCleaningTools } from "@/components/data-cleaning/DataCleaningTools";
import { CleaningActions } from "@/components/data-cleaning/CleaningActions";
import { DataEnrichment } from "@/components/data-cleaning/DataEnrichment";
import { DataPreview } from "@/components/data-cleaning/DataPreview";
import { DataCleaningPreferences } from "@/components/setup/DataCleaningPreferences";
import { HealthStatus } from "@/components/data/HealthStatus";

const DataCleaning = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Cleaning</h1>
        <HealthStatus />
        <div className="grid gap-6">
          <DataCleaningPreferences />
          <DataCleaningTools />
          <CleaningActions />
          <DataEnrichment />
          <DataPreview />
        </div>
      </div>
    </MainLayout>
  );
};

export default DataCleaning;
