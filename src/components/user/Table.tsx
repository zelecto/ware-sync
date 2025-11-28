import { useEffect, useState } from "react";
import { Trash2, Pencil, Search } from "lucide-react";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { UserRole, type User } from "@/interface/user";
import { Badge } from "../ui/badge";
import { usersService } from "@/services/users.service";
import { useFilters } from "@/hooks/useFilters";
import { FilterUtils } from "@/lib/filters";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface UserTableProps {
  filter: "ALL" | UserRole;
  onEdit: (user: User) => void;
}

interface UserTableInternalProps extends UserTableProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export function UserTable({
  filter,
  onEdit,
  searchInput,
  onSearchChange,
}: UserTableInternalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string | null;
  }>({ open: false, userId: null });

  const {
    filterParams,
    updateSearch,
    updatePage,
    updateLimit,
    addFilter,
    removeFilter,
    page,
    limit,
  } = useFilters({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    removeFilter("role");
    if (filter !== "ALL") {
      addFilter(FilterUtils.equals("role", filter));
    }
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersService.findAll(filterParams);

      setUsers(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filterParams]);

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, userId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.userId) return;

    try {
      await usersService.softDelete(confirmDialog.userId);
      toast.success("Usuario eliminado exitosamente");
      loadUsers();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar usuario";
      toast.error(errorMessage);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadUsers}>Reintentar</Button>
      </div>
    );
  }

  const columns = [
    {
      key: "fullName",
      header: "Nombre",
      accessor: (user: User) => user.person.fullName,
    },
    {
      key: "email",
      header: "Email",
      accessor: (user: User) => user.person.email,
    },
    {
      key: "phone",
      header: "Teléfono",
      accessor: (user: User) => user.person.phone,
    },
    {
      key: "role",
      header: "Rol",
      render: (user: User) => {
        const roleLabels = {
          [UserRole.ADMIN]: "Administrador",
          [UserRole.WORKER]: "Trabajador",
        };
        const roleColors = {
          [UserRole.ADMIN]: "default" as const,
          [UserRole.WORKER]: "secondary" as const,
        };
        return (
          <Badge variant={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Acciones",
      render: (user: User) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(user.personId)}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        currentPage={page}
        totalPages={meta?.totalPages || 0}
        limit={limit}
        total={meta?.total || 0}
        hasNextPage={meta?.hasNextPage || false}
        hasPreviousPage={meta?.hasPreviousPage || false}
        limitOptions={[5, 10, 25, 50]}
        onPageChange={updatePage}
        onLimitChange={updateLimit}
        isLoading={loading}
        emptyMessage={
          searchInput
            ? "No se encontraron usuarios con ese criterio de búsqueda"
            : "No hay usuarios para mostrar"
        }
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, userId: confirmDialog.userId })
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        description="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </>
  );
}
