import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Package,
  Warehouse,
  DollarSign,
  Layers,
  AlertTriangle,
  Users,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import type { Product } from "@/types/product";
import { unitLabels, type ProductUnit } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const totalStock =
    product.warehouses?.reduce((acc, w) => acc + w.quantity, 0) ?? 0;

  const warehousesWithLowStock =
    product.warehouses?.filter(
      (w) => product.minStock !== undefined && w.quantity < product.minStock
    ) ?? [];

  const hasLowStockInWarehouses = warehousesWithLowStock.length > 0;

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hola ${name}, te contacto respecto al producto ${product.name} (SKU: ${product.sku})`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent(
      `Consulta sobre producto: ${product.name}`
    );
    const body = encodeURIComponent(
      `Hola ${name},\n\nTe contacto respecto al producto:\n- Nombre: ${product.name}\n- SKU: ${product.sku}\n\n`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    SKU: {product.sku}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground mt-1 text-balance">
                    {product.name}
                  </h1>
                </div>
                <Badge
                  variant={product.isActive ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {product.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Precio de compra"
                  value={`$${Number.parseFloat(
                    product.purchasePrice
                  ).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}`}
                />
                <InfoItem
                  icon={<Layers className="w-4 h-4" />}
                  label="Unidad"
                  value={
                    product.unit ? unitLabels[product.unit as ProductUnit] : "—"
                  }
                />
                <InfoItem
                  icon={<Package className="w-4 h-4" />}
                  label="Stock mínimo"
                  value={product.minStock?.toString() ?? "—"}
                />
                <InfoItem
                  icon={<Warehouse className="w-4 h-4" />}
                  label="Stock total"
                  value={totalStock.toString()}
                />
              </div>

              {product.unitDescription && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Descripción de unidad:</span>{" "}
                  {product.unitDescription}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suppliers */}
        {product.suppliers && product.suppliers.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="w-5 h-5" />
                Proveedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {product.suppliers.map((item) => (
                  <Card key={item.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Header with Avatar */}
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(item.supplier.person.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base truncate">
                              {item.supplier.person.fullName}
                            </h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              Proveedor
                            </Badge>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2">
                          {item.supplier.person.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground truncate">
                                {item.supplier.person.email}
                              </span>
                            </div>
                          )}

                          {item.supplier.person.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">
                                {item.supplier.person.phone}
                              </span>
                            </div>
                          )}

                          {item.supplier.person.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground truncate">
                                {item.supplier.person.address}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t">
                          {item.supplier.person.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (item.supplier.person.phone) {
                                  handleWhatsApp(
                                    item.supplier.person.phone,
                                    item.supplier.person.fullName
                                  );
                                }
                              }}
                              className="flex-1"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              WhatsApp
                            </Button>
                          )}

                          {item.supplier.person.email && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (item.supplier.person.email) {
                                  handleEmail(
                                    item.supplier.person.email,
                                    item.supplier.person.fullName
                                  );
                                }
                              }}
                              className="flex-1"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warehouses */}
        {product.warehouses && product.warehouses.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Warehouse className="w-5 h-5" />
                Inventario por almacén
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {product.warehouses.map((item) => {
                  const isLowStockInWarehouse =
                    product.minStock !== undefined &&
                    item.quantity < product.minStock;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border ${
                        isLowStockInWarehouse
                          ? "bg-amber-50 border-amber-200"
                          : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {item.warehouse.name}
                            </p>
                            {isLowStockInWarehouse && (
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.warehouse.city} • {item.warehouse.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xl font-semibold ${
                              isLowStockInWarehouse
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
                      </div>
                      {isLowStockInWarehouse && (
                        <div className="mt-3 pt-3 border-t border-amber-200">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-800">
                              <span className="font-semibold">Stock bajo:</span>{" "}
                              El inventario actual está por debajo del mínimo
                              requerido ({product.minStock}). Se necesitan al
                              menos {product.minStock! - item.quantity} unidades
                              más.
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
