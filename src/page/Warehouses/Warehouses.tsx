import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WarehouseTable } from "@/components/warehouse";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Warehouses() {
  const navigate = useNavigate();

  // Actualizar breadcrumb
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
          <h2 className="text-lg font-semibold">Lista de Almacenes</h2>
        </CardHeader>
        <CardContent>
          <WarehouseTable onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}
