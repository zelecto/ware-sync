import { useState } from "react";
import type { UserRole } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/user";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Index() {
  const [filter, setFilter] = useState<"ALL" | UserRole>("ALL");

  const handleEdit = (user: any) => {
    console.log("Editar usuario:", user);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button endContent={<Plus></Plus>}>Crear nuevo</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-end w-full">
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
          <UserTable filter={filter} onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}
