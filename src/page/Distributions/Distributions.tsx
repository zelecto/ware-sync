import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { distributionsService } from "@/services/distributions.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Distribution } from "@/interface/distribution";
import { DistributionStatus } from "@/interface/distribution";
import { formatDateTime } from "@/lib/date-utils";
import toast from "react-hot-toast";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";
import { usePagination } from "@/hooks/usePagination";
import { handlePaginatedResponse } from "@/lib/pagination-helper";

const statusConfig: Record<
  DistributionStatus,
  { label: string; variant: "default" | "destructive"; className?: string }
> = {
  [DistributionStatus.PENDING]: {
    label: "Pendiente",
    variant: "default",
  },
  [DistributionStatus.COMPLETED]: {
    label: "Completada",
    variant: "default",
    className: "bg-green-500",
  },
  [DistributionStatus.CANCELLED]: {
    label: "Cancelada",
    variant: "destructive",
  },
};

export default function Distributions() {
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
      setDistributions(data);
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

  const columns = [
    {
      key: "originWarehouse",
      header: "Bodega Origen",
      render: (distribution: Distribution) => (
        <div>
          <div className="font-medium">{distribution.originWarehouse.name}</div>
          <div className="text-sm text-muted-foreground">
            {distribution.originWarehouse.city}
          </div>
        </div>
      ),
    },
    {
      key: "destination",
      header: "Destino",
      render: (distribution: Distribution) => {
        if (distribution.destinationWarehouse) {
          return (
            <div>
              <div className="font-medium">
                {distribution.destinationWarehouse.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {distribution.destinationWarehouse.city}
              </div>
            </div>
          );
        }
        if (distribution.contact) {
          return (
            <div>
              <div className="font-medium">
                {distribution.contact.person.fullName}
              </div>
              <div className="text-sm text-muted-foreground">
                {distribution.contact.type}
              </div>
            </div>
          );
        }
        return "-";
      },
    },
    {
      key: "status",
      header: "Estado",
      render: (distribution: Distribution) => {
        const config = statusConfig[distribution.status];
        return (
          <Badge variant={config.variant} className={config.className || ""}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "details",
      header: "Productos",
      accessor: (distribution: Distribution) => distribution.details.length,
    },
    {
      key: "creator",
      header: "Creado Por",
      accessor: (distribution: Distribution) =>
        distribution.creator.person.fullName,
    },
    {
      key: "createdAt",
      header: "Fecha Creación",
      render: (distribution: Distribution) => (
        <div className="text-sm">{formatDateTime(distribution.createdAt)}</div>
      ),
    },
    {
      key: "updatedAt",
      header: "Última Actualización",
      render: (distribution: Distribution) => (
        <div className="text-sm">{formatDateTime(distribution.updatedAt)}</div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (distribution: Distribution) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(distribution.id)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {distribution.status === DistributionStatus.PENDING && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleComplete(distribution.id)}
                title="Completar"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCancel(distribution.id)}
                title="Cancelar"
              >
                <XCircle className="h-4 w-4 text-orange-600" />
              </Button>
            </>
          )}
          {distribution.status !== DistributionStatus.COMPLETED && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(distribution.id)}
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

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
          <DataTable
            data={distributions}
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
            emptyMessage="No hay distribuciones registradas"
          />
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
