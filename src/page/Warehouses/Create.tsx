import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { WarehouseForm } from "@/components/warehouse";
import { warehousesService } from "@/services/warehouses.service";
import type { CreateWarehouseDto } from "@/services/warehouses.service";

export default function CreateWarehouse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateWarehouseDto) => {
    try {
      setLoading(true);
      await warehousesService.create(values);
      toast.success("Almacén creado exitosamente");
      navigate("/warehouses");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear el almacén";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/warehouses");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear Almacén</h1>
      </div>
      <WarehouseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
