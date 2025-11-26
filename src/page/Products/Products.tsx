import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/product";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Products() {
  const navigate = useNavigate();

  // Actualizar breadcrumb
  useBreadcrumbItem("Productos");

  const handleEdit = (product: any) => {
    navigate(`/products/edit/${product.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => navigate("/products/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Lista de Productos</h2>
        </CardHeader>
        <CardContent>
          <ProductTable onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  );
}
