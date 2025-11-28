import { useEffect, useState } from "react";
import { Trash2, Pencil, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import type { Product } from "@/interface/product";
import { Badge } from "../ui/badge";
import { productsService } from "@/services/products.service";
import { useFilters } from "@/hooks/useFilters";
import { unitLabels, type ProductUnit } from "@/types/product";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface ProductTableProps {
  onEdit: (product: Product) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export function ProductTable({
  onEdit,
  searchInput,
  onSearchChange,
}: ProductTableProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    productId: string | null;
  }>({ open: false, productId: null });

  const { filterParams, updateSearch, updatePage, updateLimit, page, limit } =
    useFilters({
      page: 1,
      limit: 10,
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, updateSearch]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsService.findAll(filterParams);

      setProducts(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filterParams]);

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, productId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.productId) return;

    try {
      await productsService.remove(confirmDialog.productId);
      toast.success("Producto eliminado exitosamente");
      loadProducts();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar producto";
      toast.error(errorMessage);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadProducts}>Reintentar</Button>
      </div>
    );
  }

  const columns = [
    {
      key: "sku",
      header: "SKU",
      accessor: (product: Product) => product.sku,
    },
    {
      key: "name",
      header: "Nombre",
    },
    {
      key: "unit",
      header: "Unidad",
      render: (product: Product) => (
        <>
          {product.unit ? unitLabels[product.unit as ProductUnit] : "N/A"}
          {product.unitDescription && ` (${product.unitDescription})`}
        </>
      ),
    },
    {
      key: "purchasePrice",
      header: "Precio Compra",
      render: (product: Product) => `$${product.purchasePrice}`,
    },
    {
      key: "minStock",
      header: "Stock Mínimo",
      accessor: (product: Product) => product.minStock ?? "N/A",
    },
    {
      key: "isActive",
      header: "Estado",
      render: (product: Product) => (
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (product: Product) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/products/${product.id}`)}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(product.id)}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={products}
        columns={columns}
        currentPage={page}
        totalPages={meta?.totalPages || 0}
        limit={limit}
        total={meta?.total || 0}
        hasNextPage={meta?.hasNextPage || false}
        hasPreviousPage={meta?.hasPreviousPage || false}
        limitOptions={[5, 10, 25, 50]}
        onPageChange={updatePage}
        onLimitChange={updateLimit}
        isLoading={loading}
        emptyMessage={
          searchInput
            ? "No se encontraron productos con ese criterio de búsqueda"
            : "No hay productos registrados"
        }
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, productId: confirmDialog.productId })
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        description="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </>
  );
}
