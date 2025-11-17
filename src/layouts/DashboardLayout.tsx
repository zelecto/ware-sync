import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import { type BreadcrumbItem } from "@/types";
import { AppContent } from "@/components/layout/AppContent";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppSidebarHeader } from "@/components/layout/AppSidebarHeader";

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const paths = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  if (paths.length > 1) {
    const currentPath = paths[paths.length - 1];
    const label = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
    breadcrumbs.push({ label });
  }

  return breadcrumbs;
};

export default function DashboardLayout() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <AppContent variant="sidebar">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </AppContent>
    </SidebarProvider>
  );
}
