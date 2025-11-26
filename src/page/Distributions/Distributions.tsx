import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DistributionTable } from "@/components/distribution";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { distributionsService } from "@/services/distributions.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Distribution } from "@/interface/distribution";
import toast from "react-hot-toast";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Distributions() {
  const navigate = useNavigate();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "complete" | "cancel" | "delete" | null;
    distributionId: string | null;
  }>({ open: false, type: null, distributionId: null });

  // Actualizar breadcrumb
  useBreadcrumbItem("Distribuciones");

  const loadDistributions = async () => {
    try {
      setLoading(true);
      const data = await distributionsService.findAll();
      setDistributions(data);
    } catch (error: any) {
      toast.error("Error al cargar las distribuciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistributions();
  }, []);

  const handleView = (id: string) => {
    navigate(`/distributions/show/${id}`);
  };

  const handleComplete = (id: string) => {
    setConfirmDialog({ open: true, type: "complete", distributionId: id });
  };

  const handleCancel = (id: string) => {
    setConfirmDialog({ open: true, type: "cancel", distributionId: id });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, type: "delete", distributionId: id });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.distributionId) return;

    try {
      if (confirmDialog.type === "complete") {
        await distributionsService.complete(confirmDialog.distributionId);
        toast.success("Distribución completada exitosamente");
      } else if (confirmDialog.type === "cancel") {
        await distributionsService.cancel(confirmDialog.distributionId);
        toast.success("Distribución cancelada exitosamente");
      } else if (confirmDialog.type === "delete") {
        await distributionsService.remove(confirmDialog.distributionId);
        toast.success("Distribución eliminada exitosamente");
      }
      loadDistributions();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Error al ${
          confirmDialog.type === "complete"
            ? "completar"
            : confirmDialog.type === "cancel"
            ? "cancelar"
            : "eliminar"
        } la distribución`;
      toast.error(errorMessage);
    }
  };

  const getDialogContent = () => {
    switch (confirmDialog.type) {
      case "complete":
        return {
          title: "Completar Distribución",
          description:
            "¿Está seguro de completar esta distribución? Esta acción actualizará los inventarios y no se puede deshacer.",
          confirmText: "Completar",
          variant: "default" as const,
        };
      case "cancel":
        return {
          title: "Cancelar Distribución",
          description:
            "¿Está seguro de cancelar esta distribución? Esta acción no se puede deshacer.",
          confirmText: "Cancelar Distribución",
          variant: "destructive" as const,
        };
      case "delete":
        return {
          title: "Eliminar Distribución",
          description:
            "¿Está seguro de eliminar esta distribución? Esta acción no se puede deshacer.",
          confirmText: "Eliminar",
          variant: "destructive" as const,
        };
      default:
        return {
          title: "",
          description: "",
          confirmText: "Confirmar",
          variant: "default" as const,
        };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Distribuciones</h1>
        <Button onClick={() => navigate("/distributions/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Distribución
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Lista de Distribuciones</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">
              Cargando distribuciones...
            </p>
          ) : (
            <DistributionTable
              distributions={distributions}
              onView={handleView}
              onComplete={handleComplete}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({
            open,
            type: confirmDialog.type,
            distributionId: confirmDialog.distributionId,
          })
        }
        onConfirm={handleConfirmAction}
        {...getDialogContent()}
      />
    </div>
  );
}
