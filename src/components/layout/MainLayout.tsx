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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Brain,
  CleaningServices,
  Database,
  FileSpreadsheet,
  Home,
  Target,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Data Collection", icon: FileSpreadsheet, url: "/data" },
  { title: "Data Cleaning", icon: CleaningServices, url: "/data-cleaning" },
  { title: "Predictive Models", icon: Brain, url: "/predictive-models" },
  { title: "Dashboards", icon: BarChart3, url: "/dashboards" },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={`${
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
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;