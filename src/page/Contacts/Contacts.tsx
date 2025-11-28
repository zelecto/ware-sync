import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactTable, ContactGrid } from "@/components/contact";
import { Plus, Grid3x3, List } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Contacts() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useBreadcrumbItem("Proveedores");

  const handleEdit = (contact: any) => {
    navigate(`/contacts/edit/${contact.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proveedores</h1>
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
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <ContactTable
              onEdit={handleEdit}
              searchInput={searchInput}
              onSearchChange={setSearchInput}
            />
          ) : (
            <ContactGrid
              onEdit={handleEdit}
              searchInput={searchInput}
              onSearchChange={setSearchInput}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
