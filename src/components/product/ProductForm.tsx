import { Formik, Form, Field, type FieldProps } from "formik";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui";
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  {isEditMode ? "Editar Producto" : "Información del Producto"}
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field name="sku">
                  {({ field }: FieldProps) => (
                    <div className="space-y-2">
                      <Label htmlFor="sku">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...field}
                        id="sku"
                        placeholder="PROD-001"
                        className={
                          errors.sku && touched.sku ? "border-red-500" : ""
                        }
                      />
                      {errors.sku && touched.sku && (
                        <p className="text-sm text-red-500">{errors.sku}</p>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="name">
                  {({ field }: FieldProps) => (
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Nombre del producto"
                        className={
                          errors.name && touched.name ? "border-red-500" : ""
                        }
                      />
                      {errors.name && touched.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                  )}
                </Field>

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
                      <SelectItem value={ProductUnit.KG}>Kilogramo</SelectItem>
                      <SelectItem value={ProductUnit.LITER}>Litro</SelectItem>
                      <SelectItem value={ProductUnit.METER}>Metro</SelectItem>
                      <SelectItem value={ProductUnit.BOX}>Caja</SelectItem>
                      <SelectItem value={ProductUnit.PACK}>Paquete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    </div>
                  )}
                </Field>

                <Field name="purchasePrice">
                  {({ field }: FieldProps) => (
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">
                        Precio de Compra <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...field}
                        id="purchasePrice"
                        placeholder="0.00"
                        className={
                          errors.purchasePrice && touched.purchasePrice
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.purchasePrice && touched.purchasePrice && (
                        <p className="text-sm text-red-500">
                          {errors.purchasePrice}
                        </p>
                      )}
                    </div>
                  )}
                </Field>

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
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={
                          errors.minStock && touched.minStock
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.minStock && touched.minStock && (
                        <p className="text-sm text-red-500">
                          {errors.minStock}
                        </p>
                      )}
                    </div>
                  )}
                </Field>
              </CardContent>
            </Card>

            <div className="lg:col-span-4">
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
                  values.warehouseStocks.length === 0 && touched.warehouseStocks
                    ? "Debes agregar al menos un almacén"
                    : undefined
                }
                loading={loading}
                isEditMode={isEditMode}
                onCancel={onCancel}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
