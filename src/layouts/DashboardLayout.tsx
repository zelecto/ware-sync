import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";

import { type BreadcrumbItem } from "@/types";
import { AppContent } from "@/components/layout/AppContent";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppSidebarHeader } from "@/components/layout/AppSidebarHeader";

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const paths = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  // Mapeo de rutas a etiquetas legibles
  const routeLabels: Record<string, string> = {
    users: "Usuarios",
    contacts: "Contactos",
    products: "Productos",
    warehouses: "Almacenes",
    distributions: "Distribuciones",
    create: "Crear",
    edit: "Editar",
    show: "Detalle",
  };

  // Construir breadcrumbs dinámicamente
  for (let i = 1; i < paths.length; i++) {
    const path = paths[i];
    const label =
      routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = i === paths.length - 1;

    // Si no es el último, agregar href
    if (!isLast) {
      const href = "/" + paths.slice(0, i + 1).join("/");
      breadcrumbs.push({ label, href });
    } else {
      breadcrumbs.push({ label });
    }
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
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
