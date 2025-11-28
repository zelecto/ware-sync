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

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Usuarios", url: "/users", icon: Users },
  { title: "Proveedores", url: "/contacts", icon: Contact },
  { title: "Productos", url: "/products", icon: Package },
  { title: "Almacenes", url: "/warehouses", icon: Warehouse },
  { title: "Transferencias", url: "/distributions", icon: Truck },
  { title: "Entradas", url: "/distributions/inbound", icon: ArrowDownToLine },
];

const userData = {
  name: "Usuario",
  email: "usuario@waresync.com",
  avatar: "/avatars/user.jpg",
};

export function AppSidebar() {
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
              {menuItems.map((item) => (
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
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
