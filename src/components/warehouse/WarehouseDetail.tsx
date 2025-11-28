import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Package, MapPin, Building2, AlertTriangle, Eye } from "lucide-react";
import type { Warehouse } from "@/interface/warehouse";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface WarehouseDetailProps {
  warehouse: Warehouse;
}

export function WarehouseDetail({ warehouse }: WarehouseDetailProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalProducts = warehouse.warehouseProducts?.length ?? 0;
  const totalStock =
    warehouse.warehouseProducts?.reduce((acc, p) => acc + p.quantity, 0) ?? 0;

  const productsWithLowStock =
    warehouse.warehouseProducts?.filter(
      (p) => p.product.minStock !== undefined && p.quantity < p.product.minStock
    ) ?? [];

  const hasLowStockProducts = productsWithLowStock.length > 0;

  const tableData = warehouse.warehouseProducts ?? [];
  const totalPages = Math.ceil(totalProducts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = tableData.slice(startIndex, endIndex);

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
                <DataTable
                  data={paginatedData}
                  columns={[
                    {
                      key: "sku",
                      header: "SKU",
                      accessor: (item: any) => item.product.sku,
                    },
                    {
                      key: "name",
                      header: "Nombre",
                      accessor: (item: any) => item.product.name,
                    },
                    {
                      key: "quantity",
                      header: "Cantidad",
                      render: (item: any) => {
                        const isLowStock =
                          item.product.minStock !== undefined &&
                          item.quantity < item.product.minStock;
                        return (
                          <span
                            className={
                              isLowStock ? "text-amber-600 font-semibold" : ""
                            }
                          >
                            {item.quantity}
                          </span>
                        );
                      },
                    },
                    {
                      key: "minStock",
                      header: "Stock Mínimo",
                      accessor: (item: any) => item.product.minStock ?? "N/A",
                    },
                    {
                      key: "status",
                      header: "Estado",
                      render: (item: any) => {
                        const isLowStock =
                          item.product.minStock !== undefined &&
                          item.quantity < item.product.minStock;
                        return (
                          <div className="flex gap-2">
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
                            {!isLowStock && item.product.isActive !== false && (
                              <Badge variant="default">Normal</Badge>
                            )}
                          </div>
                        );
                      },
                    },
                    {
                      key: "actions",
                      header: "Ver",
                      render: (item: any) => (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/products/${item.productId}`)
                            }
                            title="Ver detalles del producto"
                          >
                            <Eye className="w-4 h-4 text-gray-700" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  currentPage={page}
                  totalPages={totalPages}
                  limit={limit}
                  total={totalProducts}
                  hasNextPage={page < totalPages}
                  hasPreviousPage={page > 1}
                  limitOptions={[5, 10, 25, 50]}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                  isLoading={false}
                  emptyMessage="No hay productos en este almacén"
                />
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
