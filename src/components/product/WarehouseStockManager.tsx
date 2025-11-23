import { useState } from "react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Warehouse } from "@/interface/warehouse";
import { Plus, X, Warehouse as WarehouseIcon, Package } from "lucide-react";

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
  loading?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export function WarehouseStockManager({
  warehouses,
  warehouseStocks,
  onAddWarehouse,
  onRemoveWarehouse,
  onUpdateQuantity,
  loadingWarehouses,
  error,
  loading = false,
  isEditMode = false,
  onCancel,
}: WarehouseStockManagerProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleAddWarehouse = () => {
    if (selectedWarehouse && quantity) {
      onAddWarehouse(selectedWarehouse, Number.parseInt(quantity));
      setSelectedWarehouse("");
      setQuantity("");
    }
  };

  const availableWarehouses = warehouses.filter(
    (w) => !warehouseStocks.some((ws) => ws.warehouseId === w.id)
  );

  const getTotalStock = () => {
    return warehouseStocks.reduce((sum, ws) => sum + ws.initialQuantity, 0);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gestión de Almacenes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configura stock inicial por ubicación
              </p>
            </div>
          </div>
          {warehouseStocks.length > 0 && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {warehouseStocks.length} almacén
              {warehouseStocks.length > 1 ? "es" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingWarehouses ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Cargando almacenes...
            </p>
          </div>
        ) : warehouses.length === 0 ? (
          <div className="text-center py-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
            <WarehouseIcon className="w-8 h-8 mx-auto text-red-400 mb-2" />
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              No hay almacenes disponibles
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Crea uno primero
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Agregar Almacén</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedWarehouse}
                  onValueChange={setSelectedWarehouse}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecciona un almacén..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWarehouses.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground">
                        Todos los almacenes están agregados
                      </div>
                    ) : (
                      availableWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          <div className="flex items-center gap-2">
                            <WarehouseIcon className="w-3.5 h-3.5" />
                            <span>{warehouse.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {warehouse.city}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0"
                  placeholder="Cantidad"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddWarehouse}
                  disabled={!selectedWarehouse || !quantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {warehouseStocks.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <div className="flex justify-center mb-3">
                  <WarehouseIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No hay almacenes agregados
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Agrega al menos uno para continuar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {warehouseStocks.map((ws) => {
                  const warehouse = warehouses.find(
                    (w) => w.id === ws.warehouseId
                  );
                  return (
                    <div
                      key={ws.warehouseId}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-muted rounded-lg shrink-0">
                          <WarehouseIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate">
                              {warehouse?.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                            >
                              {warehouse?.city}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Stock:
                            </span>
                            {editingId === ws.warehouseId ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const newQty = parseInt(editValue);
                                      if (!isNaN(newQty) && newQty >= 0) {
                                        onUpdateQuantity(
                                          ws.warehouseId,
                                          newQty
                                        );
                                        setEditingId(null);
                                      }
                                    } else if (e.key === "Escape") {
                                      setEditingId(null);
                                    }
                                  }}
                                  className="h-6 w-20 text-xs"
                                  autoFocus
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    const newQty = parseInt(editValue);
                                    if (!isNaN(newQty) && newQty >= 0) {
                                      onUpdateQuantity(ws.warehouseId, newQty);
                                      setEditingId(null);
                                    }
                                  }}
                                >
                                  ✓
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setEditingId(null)}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(ws.warehouseId);
                                  setEditValue(ws.initialQuantity.toString());
                                }}
                                className="font-semibold text-xs hover:underline cursor-pointer"
                              >
                                {ws.initialQuantity} unidades
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveWarehouse(ws.warehouseId)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stock Total:
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {getTotalStock()} unidades
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4 mt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditMode
                  ? "Actualizar Producto"
                  : "Crear Producto"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
