import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { SupplierInboundTable } from "@/components/distribution";
import { distributionsService } from "@/services/distributions.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Distribution } from "@/interface/distribution";
import { DistributionStatus, DistributionType } from "@/interface/distribution";
import toast from "react-hot-toast";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";
import { usePagination } from "@/hooks/usePagination";
import { handlePaginatedResponse } from "@/lib/pagination-helper";

export default function SupplierInbound() {
  const navigate = useNavigate();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "complete" | "cancel" | "delete" | null;
    distributionId: string | null;
  }>({ open: false, type: null, distributionId: null });

  const pagination = usePagination({
    initialLimit: 10,
  });

  useBreadcrumbItem("Entradas desde Proveedores");

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
      // Filtrar solo entradas desde proveedores
      const supplierInbounds = data.filter(
        (d) => d.type === DistributionType.SUPPLIER_INBOUND
      );
      setDistributions(supplierInbounds);
      pagination.updateFromMeta(meta);
    } catch (error: any) {
      toast.error("Error al cargar las entradas desde proveedores");
      setDistributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistributions();
  }, [pagination.currentPage, pagination.limit]);

  const handleView = (id: string) => {
    navigate(`/distributions/inbound/show/${id}`);
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
        toast.success("Entrada completada exitosamente");
      } else if (confirmDialog.type === "cancel") {
        await distributionsService.cancel(confirmDialog.distributionId);
        toast.success("Entrada cancelada exitosamente");
      } else if (confirmDialog.type === "delete") {
        await distributionsService.remove(confirmDialog.distributionId);
        toast.success("Entrada eliminada exitosamente");
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
        } la entrada`;
      toast.error(errorMessage);
    }
  };

  const getDialogContent = () => {
    switch (confirmDialog.type) {
      case "complete":
        return {
          title: "Completar Entrada",
          description:
            "¿Está seguro de completar esta entrada? Los productos se agregarán al inventario y esta acción no se puede deshacer.",
          confirmText: "Completar",
          variant: "default" as const,
        };
      case "cancel":
        return {
          title: "Cancelar Entrada",
          description:
            "¿Está seguro de cancelar esta entrada? Solo cambiará el estado, no afecta el inventario.",
          confirmText: "Cancelar Entrada",
          variant: "destructive" as const,
        };
      case "delete":
        return {
          title: "Eliminar Entrada",
          description:
            "¿Está seguro de eliminar esta entrada? Esta acción no se puede deshacer.",
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
        <h1 className="text-2xl font-bold">Entradas desde Proveedores</h1>
        <Button onClick={() => navigate("/distributions/inbound/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Lista de Entradas</h2>
          <p className="text-sm text-muted-foreground">
            Gestione las entradas de productos desde proveedores
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <SupplierInboundTable
                distributions={distributions}
                onView={handleView}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Página {pagination.currentPage} de {pagination.totalPages} (
                    {pagination.total} entradas)
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
