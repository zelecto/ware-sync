import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactTable, ContactGrid } from "@/components/contact";
import { Plus, Grid3x3, List, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";
import { productsService } from "@/services/products.service";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function Contacts() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [product, setProduct] = useState<Product | null>(null);

  const productId = searchParams.get("productId");

  useBreadcrumbItem("Proveedores");

  const canCreate = hasRole(["ADMIN"]);

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          const productData = await productsService.findOne(productId);
          setProduct(productData);
        } catch (error) {
          console.error("Error al cargar el producto:", error);
          setProduct(null);
        }
      } else {
        setProduct(null);
      }
    };

    loadProduct();
  }, [productId]);

  const clearProductFilter = () => {
    searchParams.delete("productId");
    setSearchParams(searchParams);
  };

  const handleEdit = (contact: any) => {
    navigate(`/contacts/edit/${contact.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        {canCreate && (
          <Button onClick={() => navigate("/contacts/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Crear nuevo
          </Button>
        )}
      </div>

      {product && (
        <div className="mb-4">
          <Badge variant="secondary" className="text-sm py-2 px-3">
            Filtrando por producto: {product.name}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
              onClick={clearProductFilter}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

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
              productId={productId || undefined}
            />
          ) : (
            <ContactGrid
              onEdit={handleEdit}
              searchInput={searchInput}
              onSearchChange={setSearchInput}
              productId={productId || undefined}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
