import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Distribution } from "@/interface/distribution";
import { DistributionStatus } from "@/interface/distribution";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";

interface SupplierInboundTableProps {
  distributions: Distribution[];
  onView: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}

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

export function SupplierInboundTable({
  distributions,
  onView,
  onComplete,
  onCancel,
}: SupplierInboundTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Bodega Destino</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Creado Por</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distributions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                No hay entradas desde proveedores registradas
              </TableCell>
            </TableRow>
          ) : (
            distributions.map((distribution) => {
              const config = statusConfig[distribution.status];
              return (
                <TableRow key={distribution.id}>
                  <TableCell>
                    {distribution.contact ? (
                      <div>
                        <div className="font-medium">
                          {distribution.contact.person.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {distribution.contact.type}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {distribution.destinationWarehouse.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {distribution.destinationWarehouse.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={config.variant}
                      className={config.className || ""}
                    >
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{distribution.details.length}</TableCell>
                  <TableCell>{distribution.creator.person.fullName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDateTime(distribution.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDateTime(distribution.updatedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(distribution.id)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {distribution.status === DistributionStatus.PENDING && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onComplete(distribution.id)}
                            title="Completar entrada"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onCancel(distribution.id)}
                            title="Cancelar"
                          >
                            <XCircle className="h-4 w-4 text-orange-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
