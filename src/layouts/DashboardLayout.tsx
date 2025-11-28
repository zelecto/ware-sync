import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";

import { type BreadcrumbItem } from "@/types";
import { AppContent } from "@/components/layout/AppContent";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppSidebarHeader } from "@/components/layout/AppSidebarHeader";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/contexts/BreadcrumbContext";

const getBreadcrumbs = (
  pathname: string,
  customLabels: Record<string, string>
): BreadcrumbItem[] => {
  const paths = pathname.split("/").filter(Boolean);

  // Si solo es /dashboard, retornar solo Dashboard
  if (paths.length === 1 && paths[0] === "dashboard") {
    return [{ label: "Dashboard" }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  // Mapeo de rutas a etiquetas legibles
  const routeLabels: Record<string, string> = {
    users: "Usuarios",
    contacts: "Contactos",
    products: "Productos",
    warehouses: "Almacenes",
    distributions: "Transferencias",
    inbound: "Entradas",
    create: "Crear",
    edit: "Editar",
    show: "Detalle",
  };

  // Módulos que tienen lista
  const moduleRoutes = [
    "users",
    "contacts",
    "products",
    "warehouses",
    "distributions",
  ];

  // Construir breadcrumbs dinámicamente - empezar desde 0 para incluir el primer segmento
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const currentPath = "/" + paths.slice(0, i + 1).join("/");
    const isLast = i === paths.length - 1;
    const previousPath = i > 0 ? paths[i - 1] : null;

    if (path === "dashboard") {
      continue;
    }

    if (
      (path === "create" || path === "edit" || path === "show") &&
      previousPath &&
      moduleRoutes.includes(previousPath)
    ) {
      const modulePath = "/" + previousPath;
      const moduleLabel = customLabels[modulePath] || routeLabels[previousPath];

      const moduleExists = breadcrumbs.some((b) => b.href === modulePath);

      if (!moduleExists) {
        breadcrumbs.push({ label: moduleLabel, href: modulePath });
      }
    }

    let label = customLabels[currentPath] || routeLabels[path];

    if (!label) {
      label = path.charAt(0).toUpperCase() + path.slice(1);
    }

    if (!isLast) {
      breadcrumbs.push({ label, href: currentPath });
    } else {
      breadcrumbs.push({ label });
    }
  }

  return breadcrumbs;
};

function DashboardContent() {
  const location = useLocation();
  const { customLabels } = useBreadcrumb();
  const breadcrumbs = getBreadcrumbs(location.pathname, customLabels);

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

export default function DashboardLayout() {
  return (
    <BreadcrumbProvider>
      <DashboardContent />
    </BreadcrumbProvider>
  );
}
