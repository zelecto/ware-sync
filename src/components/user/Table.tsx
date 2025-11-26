import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { UserRole, type User } from "@/interface/user";
import { Badge } from "../ui/badge";
import { usersService } from "@/services/users.service";
import { usePagination } from "@/hooks/usePagination";
import toast from "react-hot-toast";
import { handlePaginatedResponse } from "@/lib/pagination-helper";

interface UserTableProps {
  filter: "ALL" | UserRole;
  onEdit: (user: User) => void;
}

export function UserTable({ filter, onEdit }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination({
    initialLimit: 10,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const rawResponse =
        filter !== "ALL"
          ? await usersService.findByRolePaginated(
              filter,
              pagination.paginationParams
            )
          : await usersService.findAllPaginated(pagination.paginationParams);

      const { data, meta } = handlePaginatedResponse<User>(
        rawResponse,
        pagination.currentPage,
        pagination.limit
      );
      setUsers(data);
      pagination.updateFromMeta(meta);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filter, pagination.currentPage, pagination.limit]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await usersService.softDelete(id);
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
      render: (user: User) => (
        <Badge variant={user.role === UserRole.ADMIN ? "default" : "outline"}>
          {user.role}
        </Badge>
      ),
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
    <DataTable
      data={users}
      columns={columns}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      limit={pagination.limit}
      total={pagination.total}
      hasNextPage={pagination.hasNextPage}
      hasPreviousPage={pagination.hasPreviousPage}
      limitOptions={pagination.limitOptions}
      onPageChange={pagination.setPage}
      onLimitChange={pagination.setLimit}
      isLoading={loading}
      emptyMessage="No hay usuarios para mostrar"
    />
  );
}
