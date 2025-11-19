import { useState } from "react";
import type { ContactType } from "@/interface/contact";
import { Button } from "@/components/ui/button";
import { ContactTable } from "@/components/contact";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contacts() {
  const [filter, setFilter] = useState<"ALL" | ContactType>("ALL");

  const handleEdit = (contact: any) => {
    console.log("Editar contacto:", contact);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contactos</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-end w-full">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as "ALL" | ContactType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PROVIDER">Proveedores</SelectItem>
                <SelectItem value="DISTRIBUTOR">Distribuidores</SelectItem>
                <SelectItem value="CLIENT">Clientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ContactTable filter={filter} onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}
