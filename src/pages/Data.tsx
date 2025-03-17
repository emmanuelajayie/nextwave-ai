
import MainLayout from "@/components/layout/MainLayout";
import { DataImport } from "@/components/data/DataImport";
import { DataPreview } from "@/components/data/DataPreview";
import { DataSources } from "@/components/data/DataSources";
import { CRMIntegration } from "@/components/data/CRMIntegration";
import { CRMList } from "@/components/data/CRMList";
import { WebhookConfig } from "@/components/data/WebhookConfig";
import { ScheduledTasks } from "@/components/automation/ScheduledTasks";

const Data = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <ScheduledTasks />
        <div className="grid gap-6">
          <DataImport />
          <div className="grid md:grid-cols-2 gap-6">
            <CRMIntegration />
            <CRMList />
          </div>
          <WebhookConfig />
          <DataSources />
          <DataPreview />
        </div>
      </div>
    </MainLayout>
  );
};

export default Data;
