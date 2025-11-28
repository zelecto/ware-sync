import { UserRole } from "@/interface/user";

export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.WORKER]: "Trabajador",
};

export const roleDescriptions: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Acceso completo al sistema",
  [UserRole.WORKER]: "Acceso a operaciones de almacén y distribución",
};

// Rutas permitidas por rol
export const rolePermissions = {
  [UserRole.ADMIN]: [
    "/dashboard",
    "/users",
    "/contacts",
    "/products",
    "/warehouses",
    "/distributions",
  ],
  [UserRole.WORKER]: [
    "/dashboard",
    "/products",
    "/warehouses",
    "/distributions",
  ],
};

export const canAccessRoute = (role: string, path: string): boolean => {
  const permissions = rolePermissions[role as UserRole];
  if (!permissions) return false;

  return permissions.some((allowedPath) => path.startsWith(allowedPath));
};
