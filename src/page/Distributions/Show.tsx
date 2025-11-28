import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { DistributionDetail } from "@/components/distribution";
import { distributionsService } from "@/services/distributions.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Distribution } from "@/interface/distribution";
import { DistributionType } from "@/interface/distribution";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function ShowDistribution() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "complete" | "cancel" | null;
  }>({ open: false, type: null });

  // Actualizar breadcrumb con información de la distribución
  const breadcrumbLabel = distribution
    ? distribution.originWarehouse
      ? `${distribution.originWarehouse.name} → ${distribution.destinationWarehouse.name}`
      : `${distribution.contact?.person.fullName || "Proveedor"} → ${
          distribution.destinationWarehouse.name
        }`
    : "Detalle";
  useBreadcrumbItem(breadcrumbLabel);

  const loadDistribution = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await distributionsService.findOne(id);
      setDistribution(data);
    } catch (error: any) {
      toast.error("Error al cargar la distribución");
      navigate("/distributions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistribution();
  }, [id]);

  const handleBack = () => {
    // Navegar según el tipo de distribución
    if (distribution?.type === DistributionType.SUPPLIER_INBOUND) {
      navigate("/distributions/inbound");
    } else {
      navigate("/distributions");
    }
  };

  const handleComplete = (distributionId: string) => {
    setConfirmDialog({ open: true, type: "complete" });
  };

  const handleCancel = (distributionId: string) => {
    setConfirmDialog({ open: true, type: "cancel" });
  };

  const handleConfirmAction = async () => {
    if (!id) return;

    try {
      const isSupplierInbound =
        distribution?.type === DistributionType.SUPPLIER_INBOUND;
      const entityName = isSupplierInbound ? "entrada" : "transferencia";

      if (confirmDialog.type === "complete") {
        await distributionsService.complete(id);
        toast.success(
          `${
            entityName.charAt(0).toUpperCase() + entityName.slice(1)
          } completada exitosamente`
        );
      } else if (confirmDialog.type === "cancel") {
        await distributionsService.cancel(id);
        toast.success(
          `${
            entityName.charAt(0).toUpperCase() + entityName.slice(1)
          } cancelada exitosamente`
        );
      }
      loadDistribution();
    } catch (error: any) {
      const isSupplierInbound =
        distribution?.type === DistributionType.SUPPLIER_INBOUND;
      const entityName = isSupplierInbound ? "entrada" : "transferencia";
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Error al ${
          confirmDialog.type === "complete" ? "completar" : "cancelar"
        } la ${entityName}`;
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Cargando distribución...</p>
      </div>
    );
  }

  if (!distribution) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Distribución no encontrada</p>
      </div>
    );
  }

  return (
    <>
      <DistributionDetail
        distribution={distribution}
        onBack={handleBack}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, type: confirmDialog.type })
        }
        onConfirm={handleConfirmAction}
        title={
          confirmDialog.type === "complete"
            ? distribution?.type === DistributionType.SUPPLIER_INBOUND
              ? "Completar Entrada"
              : "Completar Transferencia"
            : distribution?.type === DistributionType.SUPPLIER_INBOUND
            ? "Cancelar Entrada"
            : "Cancelar Transferencia"
        }
        description={
          confirmDialog.type === "complete"
            ? distribution?.type === DistributionType.SUPPLIER_INBOUND
              ? "¿Está seguro de completar esta entrada? Los productos se agregarán al inventario y esta acción no se puede deshacer."
              : "¿Está seguro de completar esta transferencia? Esta acción actualizará los inventarios y no se puede deshacer."
            : distribution?.type === DistributionType.SUPPLIER_INBOUND
            ? "¿Está seguro de cancelar esta entrada? Solo cambiará el estado, no afecta el inventario."
            : "¿Está seguro de cancelar esta transferencia? Esta acción devolverá el stock a la bodega de origen."
        }
        confirmText={
          confirmDialog.type === "complete"
            ? "Completar"
            : distribution?.type === DistributionType.SUPPLIER_INBOUND
            ? "Cancelar Entrada"
            : "Cancelar Transferencia"
        }
        variant={confirmDialog.type === "cancel" ? "destructive" : "default"}
      />
    </>
  );
}
