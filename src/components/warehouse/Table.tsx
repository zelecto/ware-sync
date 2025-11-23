import { useEffect, useState } from "react";
import { Trash2, Pencil, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Warehouse } from "@/interface/warehouse";
import { warehousesService } from "@/services/warehouses.service";

interface WarehouseTableProps {
  onEdit: (warehouse: Warehouse) => void;
}

export function WarehouseTable({ onEdit }: WarehouseTableProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehousesService.findAll();
      setWarehouses(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar almacenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

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

  if (loading) {
    return <div className="text-center py-8">Cargando almacenes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadWarehouses}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="w-12 h-12 text-gray-400" />
                  <p className="text-lg font-medium">
                    No hay almacenes registrados
                  </p>
                  <p className="text-sm">
                    Comienza agregando tu primer almacén
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell className="font-medium">{warehouse.name}</TableCell>
                <TableCell>{warehouse.city}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(warehouse)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(warehouse.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
