import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { DistributionTable } from "@/components/distribution";
import { distributionsService } from "@/services/distributions.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Distribution } from "@/interface/distribution";
import { DistributionStatus, DistributionType } from "@/interface/distribution";
import toast from "react-hot-toast";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";
import { usePagination } from "@/hooks/usePagination";
import { handlePaginatedResponse } from "@/lib/pagination-helper";
import { useAuth } from "@/contexts/AuthContext";

export default function Distributions() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canCreate = hasRole(["ADMIN", "WORKER"]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "complete" | "cancel" | null;
    distributionId: string | null;
  }>({ open: false, type: null, distributionId: null });

  const pagination = usePagination({
    initialLimit: 10,
  });

  useBreadcrumbItem("Distribuciones");

  const loadDistributions = async () => {
    try {
      setLoading(true);
      const rawResponse = await distributionsService.findAllPaginated(
        pagination.paginationParams
      );
      const { data, meta } = handlePaginatedResponse<Distribution>(
        rawResponse,
        pagination.currentPage,
        pagination.limit
      );
      const warehouseTransfers = data.filter(
        (d) => d.type === DistributionType.WAREHOUSE_TRANSFER
      );
      setDistributions(warehouseTransfers);
      pagination.updateFromMeta(meta);
    } catch (error: any) {
      toast.error("Error al cargar las distribuciones");
      setDistributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistributions();
  }, [pagination.currentPage, pagination.limit]);

  const handleView = (id: string) => {
    navigate(`/distributions/show/${id}`);
  };

  const handleComplete = (id: string) => {
    setConfirmDialog({ open: true, type: "complete", distributionId: id });
  };

  const handleCancel = (id: string) => {
    setConfirmDialog({ open: true, type: "cancel", distributionId: id });
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
      }
      loadDistributions();
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
            "¿Está seguro de cancelar esta distribución? Esta acción devolverá el stock a la bodega de origen.",
          confirmText: "Cancelar Distribución",
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
        <h1 className="text-2xl font-bold">Distribuciones entre Bodegas</h1>
        {canCreate && (
          <Button onClick={() => navigate("/distributions/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Distribución
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Lista de Distribuciones</h2>
          <p className="text-sm text-muted-foreground">
            Gestione las distribuciones de productos entre bodegas
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <DistributionTable
                distributions={distributions}
                onView={handleView}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Página {pagination.currentPage} de {pagination.totalPages} (
                    {pagination.total} distribuciones)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        pagination.setPage(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPreviousPage}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        pagination.setPage(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNextPage}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
