import { Formik, Form, Field, type FieldProps } from "formik";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui";
import type { Warehouse } from "@/interface/warehouse";
import type {
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from "@/services/warehouses.service";

const warehouseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  city: z.string().min(1, "La ciudad es requerida"),
  address: z.string().min(1, "La dirección es requerida"),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
  warehouse?: Warehouse;
  onSubmit: (values: CreateWarehouseDto | UpdateWarehouseDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function WarehouseForm({
  warehouse,
  onSubmit,
  onCancel,
  loading = false,
}: WarehouseFormProps) {
  const isEditMode = !!warehouse;

  const initialValues: WarehouseFormValues = {
    name: warehouse?.name || "",
    city: warehouse?.city || "",
    address: warehouse?.address || "",
  };

  const validate = (values: WarehouseFormValues) => {
    try {
      warehouseSchema.parse(values);
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

  const handleSubmit = async (values: WarehouseFormValues) => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched }) => (
        <Form>
          <Card className="max-w-lg">
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {isEditMode ? "Editar Almacén" : "Información del Almacén"}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field name="name">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Almacén Central"
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

              <Field name="city">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      Ciudad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="city"
                      placeholder="Caracas"
                      className={
                        errors.city && touched.city ? "border-red-500" : ""
                      }
                    />
                    {errors.city && touched.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="address">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="address"
                      placeholder="Av. Principal, Edificio 123"
                      className={
                        errors.address && touched.address
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.address && touched.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>
                )}
              </Field>

              <div className="flex justify-end gap-4 pt-4">
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
                    ? "Actualizar Almacén"
                    : "Crear Almacén"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
