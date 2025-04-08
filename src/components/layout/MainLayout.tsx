import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Brain,
  Database,
  Eraser,
  FileSpreadsheet,
  Home,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Data Collection", icon: FileSpreadsheet, url: "/data" },
  { title: "Data Cleaning", icon: Eraser, url: "/data-cleaning" },
  { title: "Industry Data Processing", icon: Database, url: "/industry-data-processing" },
  { title: "Predictive Models", icon: Brain, url: "/predictive-models" },
  { title: "Dashboards", icon: BarChart3, url: "/dashboards" },
  { title: "Settings", icon: SettingsIcon, url: "/settings" },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen] = useState(true);

  console.log("Current location:", location.pathname);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={`w-full ${
                          location.pathname === item.url
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => navigate(item.url)}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* Logout button */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="w-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
