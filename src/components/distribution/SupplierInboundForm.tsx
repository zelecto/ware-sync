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
import type { CreateSupplierInboundDto } from "@/services/distributions.service";
import type { Warehouse } from "@/interface/warehouse";
import type { Contact } from "@/interface/contact";
import type { Product } from "@/interface/product";
import { Trash2, Plus } from "lucide-react";

const supplierInboundSchema = z.object({
  supplierId: z.string().min(1, "El proveedor es requerido"),
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

type SupplierInboundFormValues = z.infer<typeof supplierInboundSchema>;

interface SupplierInboundFormProps {
  warehouses: Warehouse[];
  suppliers: Contact[];
  products: Product[];
  onSubmit: (values: CreateSupplierInboundDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  preselectedProductId?: string | null;
  preselectedWarehouseId?: string | null;
}

export function SupplierInboundForm({
  warehouses,
  suppliers,
  products,
  onSubmit,
  onCancel,
  loading = false,
  preselectedProductId = null,
  preselectedWarehouseId = null,
}: SupplierInboundFormProps) {
  const initialValues: SupplierInboundFormValues = {
    supplierId: "",
    destinationWarehouseId: preselectedWarehouseId || "",
    details: [{ productId: preselectedProductId || "", amount: 1 }],
  };

  const validate = (values: SupplierInboundFormValues) => {
    try {
      supplierInboundSchema.parse(values);
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

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, setFieldValue }) => {
        // Filtrar productos ya seleccionados
        const getAvailableProducts = (currentIndex: number) => {
          const selectedProductIds = values.details
            .map((d, i) => (i !== currentIndex ? d.productId : null))
            .filter(Boolean);
          return products.filter((p) => !selectedProductIds.includes(p.id));
        };

        return (
          <Form>
            <Card className="max-w-lg">
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  Nueva Entrada desde Proveedor
                </h2>
                <p className="text-sm text-muted-foreground">
                  Registre la entrada de productos desde un proveedor
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field name="supplierId">
                    {({ field }: FieldProps) => (
                      <div className="space-y-2">
                        <Label htmlFor="supplierId">
                          Proveedor <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            setFieldValue("supplierId", value)
                          }
                        >
                          <SelectTrigger
                            className={`overflow-hidden max-w-56 ${
                              errors.supplierId && touched.supplierId
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue
                              placeholder="Seleccione proveedor"
                              className="truncate"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem
                                key={supplier.id}
                                value={supplier.id}
                                className="max-w-full"
                              >
                                <span className="truncate block">
                                  {supplier.person.fullName} - {supplier.type}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.supplierId && touched.supplierId && (
                          <p className="text-sm text-red-500">
                            {errors.supplierId}
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
                              placeholder="Seleccione bodega"
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
                  <FieldArray name="details">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.details.map((detail, index) => {
                          const availableProductsForThisField =
                            getAvailableProducts(index);

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
                                    />
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
                    {loading ? "Creando..." : "Crear Entrada"}
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
