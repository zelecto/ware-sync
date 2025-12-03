import { Formik, Form, Field, FieldArray, type FieldProps } from "formik";
import { z } from "zod";
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
import { ProductAutocomplete } from "@/components/ui/product-autocomplete";
import type { CreateWarehouseTransferDto } from "@/services/distributions.service";
import type { Warehouse } from "@/interface/warehouse";
import type { Contact } from "@/interface/contact";
import type { Product } from "@/interface/product";
import { Trash2, Plus } from "lucide-react";

const distributionSchema = z.object({
  originWarehouseId: z.string().min(1, "La bodega de origen es requerida"),
  destinationWarehouseId: z
    .string()
    .min(1, "La bodega de destino es requerida"),
  details: z
    .array(
      z.object({
        productId: z.string().min(1, "El producto es requerido"),
        amount: z.number().min(1, "La cantidad debe ser mayor a 0"),
      })
    )
    .min(1, "Debe agregar al menos un producto"),
});

type DistributionFormValues = z.infer<typeof distributionSchema>;

interface DistributionFormProps {
  warehouses: Warehouse[];
  products: Product[];
  onSubmit: (values: CreateWarehouseTransferDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function DistributionForm({
  warehouses,
  products,
  onSubmit,
  onCancel,
  loading = false,
}: DistributionFormProps) {
  const initialValues: DistributionFormValues = {
    originWarehouseId: "",
    destinationWarehouseId: "",
    details: [{ productId: "", amount: 1 }],
  };

  const validate = (values: DistributionFormValues) => {
    try {
      distributionSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues.reduce((acc: Record<string, string>, curr) => {
          const path = curr.path.join(".");
          acc[path] = curr.message;
          return acc;
        }, {});
      }
      return {};
    }
  };

  const handleSubmit = async (values: DistributionFormValues) => {
    await onSubmit(values);
  };

  const getAvailableProducts = (originWarehouseId: string) => {
    if (!originWarehouseId) return [];

    return products.filter((product) => {
      const warehouseProduct = product.warehouses?.find(
        (wp) => wp.warehouseId === originWarehouseId
      );
      return warehouseProduct && warehouseProduct.quantity > 0;
    });
  };

  const getProductStock = (productId: string, originWarehouseId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;

    const warehouseProduct = product.warehouses?.find(
      (wp) => wp.warehouseId === originWarehouseId
    );
    return warehouseProduct?.quantity || 0;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, setFieldValue }) => {
        const availableProducts = getAvailableProducts(
          values.originWarehouseId
        );

        return (
          <Form>
            <Card className="max-w-lg">
              <CardHeader>
                <h2 className="text-lg font-semibold">Nueva Distribución</h2>
                <p className="text-sm text-muted-foreground">
                  Distribuya productos entre bodegas
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field name="originWarehouseId">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="originWarehouseId">
                          Bodega de Origen{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            setFieldValue("originWarehouseId", value);
                            setFieldValue("destinationWarehouseId", "");
                            setFieldValue("details", [
                              { productId: "", amount: 1 },
                            ]);
                          }}
                        >
                          <SelectTrigger
                            className={`overflow-hidden max-w-56 ${
                              errors.originWarehouseId &&
                              touched.originWarehouseId
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue
                              placeholder="Seleccione bodega de origen"
                              className="truncate"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((warehouse) => (
                              <SelectItem
                                key={warehouse.id}
                                value={warehouse.id}
                                className="max-w-full"
                              >
                                <span className="truncate block">
                                  {warehouse.name} - {warehouse.city}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.originWarehouseId &&
                          touched.originWarehouseId && (
                            <p className="text-sm text-red-500">
                              {errors.originWarehouseId}
                            </p>
                          )}
                      </div>
                    )}
                  </Field>

                  <Field name="destinationWarehouseId">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="destinationWarehouseId">
                          Bodega de Destino{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            setFieldValue("destinationWarehouseId", value)
                          }
                        >
                          <SelectTrigger
                            className={`overflow-hidden max-w-56 ${
                              errors.destinationWarehouseId &&
                              touched.destinationWarehouseId
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue
                              placeholder="Seleccione bodega de destino"
                              className="truncate"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses
                              .filter((w) => w.id !== values.originWarehouseId)
                              .map((warehouse) => (
                                <SelectItem
                                  key={warehouse.id}
                                  value={warehouse.id}
                                  className="max-w-full"
                                >
                                  <span className="truncate block">
                                    {warehouse.name} - {warehouse.city}
                                  </span>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errors.destinationWarehouseId &&
                          touched.destinationWarehouseId && (
                            <p className="text-sm text-red-500">
                              {errors.destinationWarehouseId}
                            </p>
                          )}
                      </div>
                    )}
                  </Field>
                </div>

                <div className="space-y-3">
                  <Label>
                    Productos <span className="text-red-500">*</span>
                  </Label>
                  {!values.originWarehouseId && (
                    <p className="text-sm text-muted-foreground">
                      Seleccione una bodega de origen para ver los productos
                      disponibles
                    </p>
                  )}
                  {values.originWarehouseId &&
                    availableProducts.length === 0 && (
                      <p className="text-sm text-amber-600">
                        No hay productos con stock disponible en esta bodega
                      </p>
                    )}
                  <FieldArray name="details">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.details.map((detail, index) => {
                          const stock = detail.productId
                            ? getProductStock(
                                detail.productId,
                                values.originWarehouseId
                              )
                            : 0;

                          // Filtrar productos ya seleccionados en otros campos
                          const selectedProductIds = values.details
                            .map((d, i) => (i !== index ? d.productId : null))
                            .filter(Boolean);

                          const availableProductsForThisField =
                            availableProducts.filter(
                              (p) => !selectedProductIds.includes(p.id)
                            );

                          return (
                            <div
                              key={index}
                              className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30"
                            >
                              <Field name={`details.${index}.productId`}>
                                {({ field }: FieldProps) => (
                                  <div className="flex-1 space-y-1">
                                    <ProductAutocomplete
                                      products={availableProductsForThisField}
                                      value={field.value}
                                      onChange={(value) =>
                                        setFieldValue(
                                          `details.${index}.productId`,
                                          value
                                        )
                                      }
                                      placeholder="Buscar por código o nombre..."
                                      disabled={!values.originWarehouseId}
                                      showStock={true}
                                      warehouseId={values.originWarehouseId}
                                    />
                                    {field.value && stock > 0 && (
                                      <p className="text-xs text-muted-foreground">
                                        Stock disponible: {stock}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </Field>

                              <Field name={`details.${index}.amount`}>
                                {({ field }: FieldProps) => (
                                  <div className="w-24">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="1"
                                      max={stock}
                                      placeholder="Cant."
                                      className="h-9"
                                      onChange={(e) =>
                                        setFieldValue(
                                          `details.${index}.amount`,
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      disabled={!detail.productId}
                                    />
                                  </div>
                                )}
                              </Field>

                              {values.details.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          );
                        })}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => push({ productId: "", amount: 1 })}
                          className="w-full"
                          disabled={
                            !values.originWarehouseId ||
                            availableProducts.length === 0
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Producto
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear Distribución"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
}
