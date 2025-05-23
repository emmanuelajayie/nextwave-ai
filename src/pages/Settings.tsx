
import MainLayout from "@/components/layout/MainLayout";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { UserPermissions } from "@/components/settings/UserPermissions";
import { CustomizationSettings } from "@/components/settings/CustomizationSettings";
import { SystemLogs } from "@/components/settings/SystemLogs";
import { AdminSettings } from "@/components/settings/AdminSettings";
import { HealthStatus } from "@/components/data/HealthStatus";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mb-6">
          Configure your application settings, manage users, and monitor system health.
        </p>
        <HealthStatus />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminSettings />
          <IntegrationSettings />
          <UserPermissions />
          <CustomizationSettings />
          <SystemLogs />
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
