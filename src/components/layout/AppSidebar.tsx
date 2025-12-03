import {
  Home,
  Users,
  Contact,
  Package,
  Warehouse,
  Truck,
  ArrowDownToLine,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/interface/user";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.WORKER],
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Proveedores",
    url: "/contacts",
    icon: Contact,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Productos",
    url: "/products",
    icon: Package,
    roles: [UserRole.ADMIN, UserRole.WORKER],
  },
  {
    title: "Almacenes",
    url: "/warehouses",
    icon: Warehouse,
    roles: [UserRole.ADMIN, UserRole.WORKER],
  },
  {
    title: "Distribuciones",
    url: "/distributions",
    icon: Truck,
    roles: [UserRole.ADMIN, UserRole.WORKER],
  },
  {
    title: "Entradas",
    url: "/distributions/inbound",
    icon: ArrowDownToLine,
    roles: [UserRole.ADMIN, UserRole.WORKER],
  },
];

export function AppSidebar() {
  const { user, hasRole } = useAuth();
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="WareSync Logo"
                    className="size-8 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">WareSync</span>
                  <span className="truncate text-xs">
                    Gestión de inventario
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => hasRole(item.roles))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
