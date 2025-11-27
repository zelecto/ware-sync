import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WarehouseTable } from "@/components/warehouse";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Warehouses() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  useBreadcrumbItem("Almacenes");

  const handleEdit = (warehouse: any) => {
    navigate(`/warehouses/edit/${warehouse.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Almacenes</h1>
        <Button onClick={() => navigate("/warehouses/create")}>
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
                placeholder="Buscar por nombre, ciudad o dirección..."
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WarehouseTable
            onEdit={handleEdit}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
          />
        </CardContent>
      </Card>
    </div>
  );
}
