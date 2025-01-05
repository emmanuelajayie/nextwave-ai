import MainLayout from "@/components/layout/MainLayout";

const Dashboards = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboards
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and analyze your data insights
          </p>
        </div>
        {/* Dashboard content will be implemented later */}
      </div>
    </MainLayout>
  );
};

export default Dashboards;