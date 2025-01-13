import MainLayout from "@/components/layout/MainLayout";
import { DataImport } from "@/components/data/DataImport";
import { DataPreview } from "@/components/data/DataPreview";
import { DataSources } from "@/components/data/DataSources";
import { CRMIntegration } from "@/components/data/CRMIntegration";
import { CRMList } from "@/components/data/CRMList";

const Data = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <div className="grid gap-6">
          <DataImport />
          <div className="grid md:grid-cols-2 gap-6">
            <CRMIntegration />
            <CRMList />
          </div>
          <DataSources />
          <DataPreview />
        </div>
      </div>
    </MainLayout>
  );
};

export default Data;