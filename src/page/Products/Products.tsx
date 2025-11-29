import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/product";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";
import { useAuth } from "@/contexts/AuthContext";

export default function Products() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  useBreadcrumbItem("Productos");

  const canCreate = hasRole(["ADMIN"]);

  const handleEdit = (product: any) => {
    navigate(`/products/edit/${product.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        {canCreate && (
          <Button onClick={() => navigate("/products/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Crear nuevo
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4 w-full">
            <div className="relative flex-1 max-w-lg">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable
            onEdit={handleEdit}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
          />
        </CardContent>
      </Card>
    </div>
  );
}
