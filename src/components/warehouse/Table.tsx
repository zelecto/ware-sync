import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import type { Warehouse } from "@/interface/warehouse";
import { warehousesService } from "@/services/warehouses.service";
import { usePagination } from "@/hooks/usePagination";
import { handlePaginatedResponse } from "@/lib/pagination-helper";

interface WarehouseTableProps {
  onEdit: (warehouse: Warehouse) => void;
}

export function WarehouseTable({ onEdit }: WarehouseTableProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination({
    initialLimit: 10,
  });

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const rawResponse = await warehousesService.findAllPaginated(
        pagination.paginationParams
      );
      const { data, meta } = handlePaginatedResponse<Warehouse>(
        rawResponse,
        pagination.currentPage,
        pagination.limit
      );
      setWarehouses(data);
      pagination.updateFromMeta(meta);
    } catch (err: any) {
      setError(err.message || "Error al cargar almacenes");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, [pagination.currentPage, pagination.limit]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este almacén?")) return;

    try {
      await warehousesService.remove(id);
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
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={warehouses}
      columns={columns}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      limit={pagination.limit}
      total={pagination.total}
      hasNextPage={pagination.hasNextPage}
      hasPreviousPage={pagination.hasPreviousPage}
      limitOptions={pagination.limitOptions}
      onPageChange={pagination.setPage}
      onLimitChange={pagination.setLimit}
      isLoading={loading}
      emptyMessage="No hay almacenes registrados"
    />
  );
}
