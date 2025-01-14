import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
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
  Eraser,
  FileSpreadsheet,
  Home,
  Menu,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Data Collection", icon: FileSpreadsheet, url: "/data" },
  { title: "Data Cleaning", icon: Eraser, url: "/data-cleaning" },
  { title: "Predictive Models", icon: Brain, url: "/predictive-models" },
  { title: "Dashboards", icon: BarChart3, url: "/dashboards" },
  { title: "Settings", icon: SettingsIcon, url: "/settings" },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  console.log("Current location:", location.pathname);
  console.log("Is mobile:", isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    console.log("Toggling sidebar:", !isOpen);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Sidebar */}
        <Sidebar
          className={cn(
            "border-r transition-all duration-300",
            isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
            isMobile ? "fixed inset-y-0 z-40 bg-background" : "relative"
          )}
        >
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
                        onClick={() => {
                          navigate(item.url);
                          if (isMobile) setIsOpen(false);
                        }}
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

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-4 md:p-8 overflow-auto",
          isMobile && "pt-16" // Add padding top on mobile to account for the menu button
        )}>
          {children}
        </main>

        {/* Mobile Overlay */}
        {isMobile && isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;