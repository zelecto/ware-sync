import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UserRole, type User } from "@/interface/user";
import { Badge } from "../ui/badge";
import { usersService } from "@/services/users.service";

interface UserTableProps {
  filter: "ALL" | UserRole;
  onEdit: (user: User) => void;
}

export function UserTable({ filter, onEdit }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data =
        filter === "ALL"
          ? await usersService.findAll()
          : await usersService.findByRole(filter);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await usersService.softDelete(id);
      loadUsers();
    } catch (err: any) {
      alert(err.message || "Error al eliminar usuario");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadUsers}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No hay usuarios para mostrar
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.personId}>
                <TableCell className="font-medium">
                  {user.person.fullName}
                </TableCell>
                <TableCell>{user.person.email}</TableCell>
                <TableCell>{user.person.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === UserRole.ADMIN ? "default" : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.personId)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
