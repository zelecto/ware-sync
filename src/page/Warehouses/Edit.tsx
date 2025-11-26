import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { WarehouseForm } from "@/components/warehouse";
import { warehousesService } from "@/services/warehouses.service";
import type { Warehouse } from "@/interface/warehouse";
import type { UpdateWarehouseDto } from "@/services/warehouses.service";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function EditWarehouse() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loadingWarehouse, setLoadingWarehouse] = useState(true);

  // Actualizar breadcrumb con el nombre del almacén
  useBreadcrumbItem(warehouse?.name || "Editar");

  useEffect(() => {
    const loadWarehouse = async () => {
      if (!id) return;
      try {
        const data = await warehousesService.findOne(id);
        setWarehouse(data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al cargar el almacén";
        toast.error(errorMessage);
        navigate("/warehouses");
      } finally {
        setLoadingWarehouse(false);
      }
    };

    loadWarehouse();
  }, [id, navigate]);

  const handleSubmit = async (values: UpdateWarehouseDto) => {
    if (!id) return;
    try {
      setLoading(true);
      await warehousesService.update(id, values);
      toast.success("Almacén actualizado exitosamente");
      navigate("/warehouses");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar el almacén";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/warehouses");
  };

  if (loadingWarehouse) {
    return <div className="text-center py-8">Cargando almacén...</div>;
  }

  if (!warehouse) {
    return <div className="text-center py-8">Almacén no encontrado</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Almacén</h1>
      </div>
      <WarehouseForm
        warehouse={warehouse}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
