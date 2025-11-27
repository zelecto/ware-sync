import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ContactType } from "@/interface/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Contacts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"ALL" | ContactType>("ALL");
  const [searchInput, setSearchInput] = useState("");

  useBreadcrumbItem("Contactos");

  const handleEdit = (contact: any) => {
    navigate(`/contacts/edit/${contact.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contactos</h1>
        <Button onClick={() => navigate("/contacts/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4 w-full">
            <div className="relative flex-1 max-w-lg">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre, cédula, email o teléfono..."
              />
            </div>
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
          <ContactTable
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
