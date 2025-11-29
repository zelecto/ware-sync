import { useEffect, useState } from "react";
import { Trash2, Pencil, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import type { Warehouse } from "@/interface/warehouse";
import { warehousesService } from "@/services/warehouses.service";
import { useFilters } from "@/hooks/useFilters";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";

interface WarehouseTableProps {
  onEdit: (warehouse: Warehouse) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export function WarehouseTable({
  onEdit,
  searchInput,
  onSearchChange,
}: WarehouseTableProps) {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    warehouseId: string | null;
  }>({ open: false, warehouseId: null });

  const canEdit = hasRole(["ADMIN"]);

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

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await warehousesService.findAll(filterParams);

      setWarehouses(response.data);
      setMeta(response.pagination);
    } catch (err: any) {
      setError(err.message || "Error al cargar almacenes");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, [filterParams]);

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, warehouseId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.warehouseId) return;

    try {
      await warehousesService.remove(confirmDialog.warehouseId);
      toast.success("Almacén eliminado exitosamente");
      loadWarehouses();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar almacén";
      toast.error(errorMessage);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadWarehouses}>Reintentar</Button>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: "Nombre",
    },
    {
      key: "city",
      header: "Ciudad",
    },
    {
      key: "address",
      header: "Dirección",
    },
    {
      key: "actions",
      header: "Acciones",
      render: (warehouse: Warehouse) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/warehouses/${warehouse.id}`)}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4 " />
          </Button>
          {canEdit && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(warehouse)}
                title="Editar"
              >
                <Pencil className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(warehouse.id)}
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={warehouses}
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
            ? "No se encontraron almacenes con ese criterio de búsqueda"
            : "No hay almacenes registrados"
        }
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, warehouseId: confirmDialog.warehouseId })
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar Almacén"
        description="¿Estás seguro de eliminar este almacén? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </>
  );
}
