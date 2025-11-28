import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  MapPin,
  Building2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { Warehouse } from "@/interface/warehouse";
import { useNavigate } from "react-router-dom";

interface WarehouseDetailProps {
  warehouse: Warehouse;
}

export function WarehouseDetail({ warehouse }: WarehouseDetailProps) {
  const navigate = useNavigate();

  // Calcular el total de productos y stock
  const totalProducts = warehouse.warehouseProducts?.length ?? 0;
  const totalStock =
    warehouse.warehouseProducts?.reduce((acc, p) => acc + p.quantity, 0) ?? 0;

  // Productos con stock bajo
  const productsWithLowStock =
    warehouse.warehouseProducts?.filter(
      (p) => p.product.minStock !== undefined && p.quantity < p.product.minStock
    ) ?? [];

  const hasLowStockProducts = productsWithLowStock.length > 0;

  return (
    <div className="">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-balance">
                    {warehouse.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{warehouse.city}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Dirección"
                  value={warehouse.address}
                />
                <InfoItem
                  icon={<Package className="w-4 h-4" />}
                  label="Total de productos"
                  value={totalProducts.toString()}
                />
                <InfoItem
                  icon={<Package className="w-4 h-4" />}
                  label="Stock total"
                  value={totalStock.toString()}
                  alert={hasLowStockProducts}
                />
              </div>

              {hasLowStockProducts && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Alerta de stock bajo
                      </p>
                      <p className="text-xs text-amber-800 mt-1">
                        {productsWithLowStock.length} producto
                        {productsWithLowStock.length !== 1 ? "s" : ""} con stock
                        por debajo del mínimo requerido
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products in Warehouse */}
        {warehouse.warehouseProducts &&
          warehouse.warehouseProducts.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos en este almacén
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {warehouse.warehouseProducts.map((item) => {
                    const isLowStock =
                      item.product.minStock !== undefined &&
                      item.quantity < item.product.minStock;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          isLowStock
                            ? "bg-amber-50 border-amber-200"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-base">
                                {item.product.name}
                              </h4>
                              {isLowStock && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-100 text-amber-800 border-amber-300"
                                >
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Stock bajo
                                </Badge>
                              )}
                              {item.product.isActive === false && (
                                <Badge variant="secondary">Inactivo</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              SKU: {item.product.sku}
                            </p>
                            {item.product.minStock !== undefined && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Stock mínimo: {item.product.minStock} unidades
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p
                                className={`text-2xl font-semibold ${
                                  isLowStock
                                    ? "text-amber-600"
                                    : "text-foreground"
                                }`}
                              >
                                {item.quantity}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                unidades
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(`/products/${item.productId}`)
                              }
                              title="Ver detalles del producto"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {isLowStock && (
                          <div className="mt-3 pt-3 border-t border-amber-200">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              <p className="text-xs text-amber-800">
                                <span className="font-semibold">
                                  Requiere reabastecimiento:
                                </span>{" "}
                                El inventario actual está por debajo del mínimo
                                requerido. Se necesitan al menos{" "}
                                {item.product.minStock! - item.quantity}{" "}
                                unidades más.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Empty State */}
        {(!warehouse.warehouseProducts ||
          warehouse.warehouseProducts.length === 0) && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Sin productos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Este almacén no tiene productos asignados actualmente
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p
        className={`text-lg font-medium ${
          alert ? "text-amber-600" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
