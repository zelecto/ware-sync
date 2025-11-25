import { Card, CardContent, CardHeader } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Distribution } from "@/interface/distribution";
import { DistributionStatus } from "@/interface/distribution";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { formatDate, formatTime, formatDateTime } from "@/lib/date-utils";

interface DistributionDetailProps {
  distribution: Distribution;
  onBack: () => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusConfig = {
  [DistributionStatus.PENDING]: {
    label: "Pendiente",
    variant: "default" as const,
  },
  [DistributionStatus.COMPLETED]: {
    label: "Completada",
    variant: "default" as const,
    className: "bg-green-500",
  },
  [DistributionStatus.CANCELLED]: {
    label: "Cancelada",
    variant: "destructive" as const,
  },
};

export function DistributionDetail({
  distribution,
  onBack,
  onComplete,
  onCancel,
}: DistributionDetailProps) {
  const config = statusConfig[distribution.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detalle de Distribución</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">Información General</h2>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Creada el {formatDate(distribution.createdAt)} a las{" "}
                  {formatTime(distribution.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Última actualización: {formatDateTime(distribution.updatedAt)}
                </p>
              </div>
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Bodega de Origen
              </p>
              <p className="text-base font-semibold">
                {distribution.originWarehouse.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {distribution.originWarehouse.city} -{" "}
                {distribution.originWarehouse.address}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Destino
              </p>
              {distribution.destinationWarehouse ? (
                <>
                  <p className="text-base font-semibold">
                    {distribution.destinationWarehouse.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {distribution.destinationWarehouse.city} -{" "}
                    {distribution.destinationWarehouse.address}
                  </p>
                </>
              ) : distribution.contact ? (
                <>
                  <p className="text-base font-semibold">
                    {distribution.contact.person.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {distribution.contact.type} -{" "}
                    {distribution.contact.person.email}
                  </p>
                </>
              ) : (
                <p className="text-base">-</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Creado Por
              </p>
              <p className="text-base font-semibold">
                {distribution.creator.person.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {distribution.creator.person.email}
              </p>
            </div>
          </div>

          {distribution.status === DistributionStatus.PENDING &&
            onComplete &&
            onCancel && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => onComplete(distribution.id)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Completar Distribución
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onCancel(distribution.id)}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancelar Distribución
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Productos</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distribution.details.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell className="font-mono">
                    {detail.product.sku}
                  </TableCell>
                  <TableCell className="font-medium">
                    {detail.product.name}
                  </TableCell>
                  <TableCell>
                    {detail.product.unit ||
                      detail.product.unitDescription ||
                      "-"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {detail.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
