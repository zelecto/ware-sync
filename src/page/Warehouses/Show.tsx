import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WarehouseDetail } from "@/components/warehouse";
import { warehousesService } from "@/services/warehouses.service";
import type { Warehouse } from "@/interface/warehouse";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function ShowWarehouse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useBreadcrumbItem(warehouse?.name || "Detalle");

  useEffect(() => {
    const fetchWarehouse = async () => {
      if (!id) {
        setError("ID de almacén no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await warehousesService.findOne(id);
        setWarehouse(data);
      } catch (err) {
        console.error("Error al cargar el almacén:", err);
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el almacén. Por favor, intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium text-foreground">
              Cargando almacén...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor espera un momento
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Error al cargar
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {error || "Almacén no encontrado"}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/warehouses")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a almacenes
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <WarehouseDetail warehouse={warehouse} />;
}
