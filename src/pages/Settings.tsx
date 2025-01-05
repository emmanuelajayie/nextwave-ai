import MainLayout from "@/components/layout/MainLayout";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { AutomationSettings } from "@/components/automation/AutomationSettings";
import { UserPermissions } from "@/components/settings/UserPermissions";
import { CustomizationSettings } from "@/components/settings/CustomizationSettings";
import { SystemLogs } from "@/components/settings/SystemLogs";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntegrationSettings />
          <AutomationSettings />
          <UserPermissions />
          <CustomizationSettings />
          <SystemLogs />
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;