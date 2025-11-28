import { Formik, Form, Field, type FieldProps } from "formik";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductUnit, type Product } from "@/interface/product";
import type {
  CreateProductDto,
  UpdateProductDto,
} from "@/services/products.service";
import { warehousesService } from "@/services/warehouses.service";
import type { Warehouse } from "@/interface/warehouse";
import { WarehouseStockManager } from "./WarehouseStockManager";
import { SupplierSelector } from "./SupplierSelector";

interface WarehouseStock {
  warehouseId: string;
  initialQuantity: number;
}

const productSchema = z.object({
  sku: z.string().min(1, "El SKU es requerido").max(100),
  name: z.string().min(1, "El nombre es requerido").max(255),
  unit: z.nativeEnum(ProductUnit).optional(),
  unitDescription: z.string().max(255).optional(),
  purchasePrice: z.string().min(1, "El precio de compra es requerido"),
  minStock: z
    .number()
    .min(0, "El stock mínimo debe ser mayor o igual a 0")
    .optional(),
  isActive: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema> & {
  warehouseStocks: WarehouseStock[];
  supplierIds: string[];
};

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: CreateProductDto | UpdateProductDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const isEditMode = !!product;
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const response = await warehousesService.findAll({
          page: 1,
          limit: 50,
        });
        setWarehouses(response.data);
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    loadWarehouses();
  }, []);

  const initialValues: ProductFormValues = {
    sku: product?.sku || "",
    name: product?.name || "",
    unit: product?.unit,
    unitDescription: product?.unitDescription || "",
    purchasePrice: product?.purchasePrice || "",
    minStock: product?.minStock || 0,
    isActive: product?.isActive ?? true,
    warehouseStocks: product?.warehouses
      ? product.warehouses.map((w) => ({
          warehouseId: w.warehouseId,
          initialQuantity: w.quantity,
        }))
      : [],
    supplierIds: product?.suppliers
      ? product.suppliers.map((s) => s.supplier.id)
      : [],
  };

  const validate = (values: ProductFormValues) => {
    const errors: Record<string, string> = {};

    try {
      productSchema.parse(values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          errors[path] = issue.message;
        });
      }
    }

    if (values.warehouseStocks.length === 0) {
      errors.warehouseStocks = "Debes agregar al menos un almacén";
    }

    const validSupplierIds = values.supplierIds.filter(
      (id) => id != null && id !== ""
    );
    if (validSupplierIds.length === 0) {
      errors.supplierIds = "Debes agregar al menos un proveedor";
    }

    return errors;
  };

  const handleSubmit = async (values: ProductFormValues) => {
    const submitData: any = {
      sku: values.sku,
      name: values.name,
      unit: values.unit,
      unitDescription: values.unitDescription,
      purchasePrice: values.purchasePrice,
      minStock: values.minStock,
      isActive: values.isActive,
      warehouses: values.warehouseStocks.map((ws) => ({
        warehouseId: ws.warehouseId,
        initialQuantity: ws.initialQuantity,
      })),
      supplierIds: values.supplierIds.filter((id) => id != null && id !== ""),
    };
    await onSubmit(submitData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form>
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Main Product Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Información General</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      Datos básicos del producto
                    </p>
                  </div>
                  {isEditMode && (
                    <Badge variant="outline" className="text-xs">
                      Editando
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* SKU Field */}
                  <Field name="sku">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          Código SKU <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          {...field}
                          id="sku"
                          placeholder="Ej: PROD-001"
                          required
                          className={
                            errors.sku && touched.sku
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.sku && touched.sku && (
                          <p className="text-xs text-destructive">
                            {errors.sku}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>

                  {/* Name Field */}
                  <Field name="name">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nombre del Producto{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Nombre completo del producto"
                          required
                          className={
                            errors.name && touched.name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.name && touched.name && (
                          <p className="text-xs text-destructive">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>

                  {/* Unit Field */}
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidad de Medida</Label>
                    <Select
                      value={values.unit || ""}
                      onValueChange={(value) =>
                        setFieldValue("unit", value || undefined)
                      }
                    >
                      <SelectTrigger id="unit" className="w-full">
                        <SelectValue placeholder="Selecciona una unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ProductUnit.UNIT}>Unidad</SelectItem>
                        <SelectItem value={ProductUnit.BOX}>Caja</SelectItem>
                        <SelectItem value={ProductUnit.PACKAGE}>
                          Paquete
                        </SelectItem>
                        <SelectItem value={ProductUnit.BAG}>Bolsa</SelectItem>
                        <SelectItem value={ProductUnit.LITER}>Litro</SelectItem>
                        <SelectItem value={ProductUnit.KILO}>
                          Kilogramo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit Description Field */}
                  <Field name="unitDescription">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="unitDescription">
                          Descripción de Unidad
                        </Label>
                        <Input
                          {...field}
                          id="unitDescription"
                          placeholder="Ej: Caja de 12 unidades"
                        />
                        <p className="text-xs text-muted-foreground">
                          Opcional: detalles adicionales sobre la unidad
                        </p>
                      </div>
                    )}
                  </Field>
                </div>

                <Separator className="my-6" />

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Purchase Price Field */}
                  <Field name="purchasePrice">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="purchasePrice">
                          Precio de Compra{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            $
                          </span>
                          <Input
                            {...field}
                            id="purchasePrice"
                            placeholder="0.00"
                            required
                            className={`pl-7 ${
                              errors.purchasePrice && touched.purchasePrice
                                ? "border-destructive"
                                : ""
                            }`}
                          />
                        </div>
                        {errors.purchasePrice && touched.purchasePrice && (
                          <p className="text-xs text-destructive">
                            {errors.purchasePrice}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>

                  {/* Min Stock Field */}
                  <Field name="minStock">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="minStock">Stock Mínimo</Label>
                        <Input
                          {...field}
                          id="minStock"
                          type="number"
                          min="0"
                          placeholder="0"
                          onChange={(e) =>
                            setFieldValue(
                              "minStock",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          className={
                            errors.minStock && touched.minStock
                              ? "border-destructive"
                              : ""
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Alerta cuando el stock sea menor a este valor
                        </p>
                        {errors.minStock && touched.minStock && (
                          <p className="text-xs text-destructive">
                            {errors.minStock}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
              </CardContent>
            </Card>

            {/* Suppliers and Warehouses Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Suppliers Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Proveedores <span className="text-destructive">*</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Asigna uno o más proveedores
                  </p>
                </CardHeader>
                <CardContent>
                  <SupplierSelector
                    selectedSupplierIds={values.supplierIds.filter(
                      (id) => id != null && id !== ""
                    )}
                    onAddSupplier={(supplierId) => {
                      if (supplierId && supplierId.trim() !== "") {
                        setFieldValue("supplierIds", [
                          ...values.supplierIds.filter(
                            (id) => id != null && id !== ""
                          ),
                          supplierId,
                        ]);
                      }
                    }}
                    onRemoveSupplier={(supplierId) => {
                      setFieldValue(
                        "supplierIds",
                        values.supplierIds.filter(
                          (id) => id !== supplierId && id != null && id !== ""
                        )
                      );
                    }}
                    error={
                      values.supplierIds.filter((id) => id != null && id !== "")
                        .length === 0 && touched.supplierIds
                        ? "Debes agregar al menos un proveedor"
                        : undefined
                    }
                  />
                </CardContent>
              </Card>

              {/* Warehouses Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Almacenes <span className="text-destructive">*</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Define el stock inicial por almacén
                  </p>
                </CardHeader>
                <CardContent>
                  <WarehouseStockManager
                    warehouses={warehouses}
                    warehouseStocks={values.warehouseStocks}
                    onAddWarehouse={(warehouseId, quantity) => {
                      setFieldValue("warehouseStocks", [
                        ...values.warehouseStocks,
                        { warehouseId, initialQuantity: quantity },
                      ]);
                    }}
                    onRemoveWarehouse={(warehouseId) => {
                      setFieldValue(
                        "warehouseStocks",
                        values.warehouseStocks.filter(
                          (ws) => ws.warehouseId !== warehouseId
                        )
                      );
                    }}
                    onUpdateQuantity={(warehouseId, quantity) => {
                      setFieldValue(
                        "warehouseStocks",
                        values.warehouseStocks.map((ws) =>
                          ws.warehouseId === warehouseId
                            ? { ...ws, initialQuantity: quantity }
                            : ws
                        )
                      );
                    }}
                    loadingWarehouses={loadingWarehouses}
                    error={
                      values.warehouseStocks.length === 0 &&
                      touched.warehouseStocks
                        ? "Debes agregar al menos un almacén"
                        : undefined
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 rounded-lg border bg-card p-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Guardando...</span>
                ) : isEditMode ? (
                  "Actualizar Producto"
                ) : (
                  "Crear Producto"
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
