import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Warehouse } from "@/interface/warehouse";

interface WarehouseStock {
  warehouseId: string;
  initialQuantity: number;
}

interface WarehouseStockManagerProps {
  warehouses: Warehouse[];
  warehouseStocks: WarehouseStock[];
  onAddWarehouse: (warehouseId: string, quantity: number) => void;
  onRemoveWarehouse: (warehouseId: string) => void;
  onUpdateQuantity: (warehouseId: string, quantity: number) => void;
  loadingWarehouses: boolean;
  error?: string;
}

export function WarehouseStockManager({
  warehouses,
  warehouseStocks,
  onAddWarehouse,
  onRemoveWarehouse,
  onUpdateQuantity,
  loadingWarehouses,
  error,
}: WarehouseStockManagerProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const handleAddWarehouse = () => {
    if (selectedWarehouse && quantity) {
      const qty = Number.parseInt(quantity);
      if (!isNaN(qty) && qty >= 0) {
        onAddWarehouse(selectedWarehouse, qty);
        setSelectedWarehouse("");
        setQuantity("");
      }
    }
  };

  const availableWarehouses = warehouses.filter(
    (w) => !warehouseStocks.some((ws) => ws.warehouseId === w.id)
  );

  if (loadingWarehouses) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Cargando almacenes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Warehouse */}
      {availableWarehouses.length > 0 && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Agregar Almacén
          </Label>
          <div className="flex gap-2">
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecciona un almacén" />
              </SelectTrigger>
              <SelectContent>
                {availableWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="0"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-28"
            />
            <Button
              type="button"
              onClick={handleAddWarehouse}
              disabled={!selectedWarehouse || !quantity}
              size="sm"
            >
              Agregar
            </Button>
          </div>
        </div>
      )}

      {/* Selected Warehouses */}
      {warehouseStocks.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Almacenes Asignados
          </Label>
          <div className="space-y-2">
            {warehouseStocks.map((ws) => {
              const warehouse = warehouses.find((w) => w.id === ws.warehouseId);
              return (
                <div
                  key={ws.warehouseId}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {warehouse?.name || "Desconocido"}
                      </p>
                      {warehouse?.city && (
                        <Badge variant="secondary" className="text-xs">
                          {warehouse.city}
                        </Badge>
                      )}
                    </div>
                    {warehouse?.address && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {warehouse.address}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Input
                      type="number"
                      min="0"
                      value={ws.initialQuantity}
                      onChange={(e) => {
                        const newQty = Number.parseInt(e.target.value);
                        if (!isNaN(newQty) && newQty >= 0) {
                          onUpdateQuantity(ws.warehouseId, newQty);
                        }
                      }}
                      className="w-20 text-center"
                    />
                    <span className="text-xs text-muted-foreground">
                      unidades
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveWarehouse(ws.warehouseId)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {warehouseStocks.length === 0 && (
        <div className="rounded-lg border border-dashed py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No has agregado ningún almacén
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
