import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Warehouse,
  TrendingUp,
  AlertTriangle,
  ArrowRightLeft,
  Loader2,
  ArrowDownToLine,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dashboardService,
  type DashboardData,
} from "@/services/dashboard.service";
import { getUnitLabel } from "@/lib/unit-labels";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error al cargar los datos del dashboard:", error);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {error || "No se pudieron cargar los datos"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <header className="">
        <div className="container mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Panel de Control WareSync
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Gestión de Inventario
              </p>
            </div>
            <Button
              onClick={() => navigate("/distributions/inbound/create")}
              className="flex items-center gap-2"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Nueva Entrada
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {dashboardData.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Productos activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Almacenes
              </CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {dashboardData.totalWarehouses}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ubicaciones activas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stock Bajo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-destructive">
                {dashboardData.lowStockProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Inventario
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                $
                {Number.parseFloat(
                  dashboardData.totalInventoryValue
                ).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor total estimado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Status & Top Products */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Distribution Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Estado de Distribuciones
              </CardTitle>
              <CardDescription>
                Resumen de movimientos de inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-sm text-muted-foreground">
                      Pendientes
                    </span>
                  </div>
                  <span className="text-2xl font-semibold">
                    {dashboardData.distributions.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-muted-foreground">
                      Completadas
                    </span>
                  </div>
                  <span className="text-2xl font-semibold">
                    {dashboardData.distributions.completed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="text-sm text-muted-foreground">
                      Canceladas
                    </span>
                  </div>
                  <span className="text-2xl font-semibold">
                    {dashboardData.distributions.cancelled}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos Más Distribuidos
              </CardTitle>
              <CardDescription>Top 4 productos por volumen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.topProducts.map((product, index) => (
                  <div
                    key={product.sku}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium">
                          {product.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {product.distributed}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getUnitLabel(product.unit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Stock Alert */}
        <Card className="mb-8 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Productos con Stock Crítico
            </CardTitle>
            <CardDescription>
              Productos por debajo del stock mínimo. Click para crear entrada de
              inventario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.criticalStock.map((item) => (
                <div
                  key={item.sku}
                  onClick={() => {
                    const url = `/distributions/inbound/create?sku=${encodeURIComponent(
                      item.sku
                    )}&warehouse=${encodeURIComponent(item.warehouse)}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                    // Mantener el foco en la pestaña actual
                    window.focus();
                  }}
                  className="flex items-center justify-between rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 hover:border-destructive/50 transition-colors"
                  title="Click para crear entrada de inventario"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {item.sku}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {item.warehouse}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Actual / Mínimo
                      </div>
                      <div className="text-sm font-semibold">
                        <span className="text-destructive">{item.current}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {item.min}
                        </span>
                      </div>
                    </div>
                    <Badge variant="destructive" className="font-normal">
                      Crítico
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
