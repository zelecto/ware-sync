import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { DistributionDetail } from "@/components/distribution";
import { distributionsService } from "@/services/distributions.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Distribution } from "@/interface/distribution";
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
    ? `${distribution.originWarehouse.name} → ${
        distribution.destinationWarehouse?.name ||
        distribution.contact?.person.fullName ||
        "Cliente"
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
    navigate("/distributions");
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
      if (confirmDialog.type === "complete") {
        await distributionsService.complete(id);
        toast.success("Distribución completada exitosamente");
      } else if (confirmDialog.type === "cancel") {
        await distributionsService.cancel(id);
        toast.success("Distribución cancelada exitosamente");
      }
      loadDistribution();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Error al ${
          confirmDialog.type === "complete" ? "completar" : "cancelar"
        } la distribución`;
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
            ? "Completar Distribución"
            : "Cancelar Distribución"
        }
        description={
          confirmDialog.type === "complete"
            ? "¿Está seguro de completar esta distribución? Esta acción actualizará los inventarios y no se puede deshacer."
            : "¿Está seguro de cancelar esta distribución? Esta acción no se puede deshacer."
        }
        confirmText={
          confirmDialog.type === "complete"
            ? "Completar"
            : "Cancelar Distribución"
        }
        variant={confirmDialog.type === "cancel" ? "destructive" : "default"}
      />
    </>
  );
}
