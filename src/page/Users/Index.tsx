import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/user";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, Input } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Index() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"ALL" | UserRole>("ALL");
  const [searchInput, setSearchInput] = useState("");

  useBreadcrumbItem("Usuarios");

  const handleEdit = (user: any) => {
    navigate(`/users/edit/${user.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button onClick={() => navigate("/users/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4 w-full">
            {/* Buscador */}
            <div className="relative flex-1 max-w-lg">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre, cédula, email o teléfono..."
              />
            </div>

            {/* Filtro por rol */}
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as "ALL" | UserRole)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ADMIN">Administradores</SelectItem>
                  <SelectItem value="WORKER">Trabajadores</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            filter={filter}
            onEdit={handleEdit}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
          />
        </CardContent>
      </Card>
    </div>
  );
}
