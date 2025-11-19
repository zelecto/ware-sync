import { Formik, Form, Field, type FieldProps } from "formik";
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
import { ContactType, type Contact } from "@/interface/contact";
import type {
  CreateContactWithPersonDto,
  UpdateContactWithPersonDto,
} from "@/services/contacts.service";

const contactSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  cedula: z.string().min(1, "La cédula es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("El correo electrónico no es válido"),
  address: z.string().optional(),
  type: z.enum([
    ContactType.PROVIDER,
    ContactType.DISTRIBUTOR,
    ContactType.CLIENT,
  ]),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (
    values: CreateContactWithPersonDto | UpdateContactWithPersonDto
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ContactForm({
  contact,
  onSubmit,
  onCancel,
  loading = false,
}: ContactFormProps) {
  const isEditMode = !!contact;

  const initialValues: ContactFormValues = {
    fullName: contact?.person.fullName || "",
    cedula: contact?.person.cedula || "",
    phone: contact?.person.phone || "",
    email: contact?.person.email || "",
    address: contact?.person.address || "",
    type: contact?.type || ContactType.CLIENT,
  };

  const validate = (values: ContactFormValues) => {
    try {
      contactSchema.parse(values);
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

  const handleSubmit = async (values: ContactFormValues) => {
    await onSubmit(values);
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
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {isEditMode ? "Editar Contacto" : "Información del Contacto"}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field name="fullName">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Nombre Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="fullName"
                      placeholder="Juan Pérez"
                      className={
                        errors.fullName && touched.fullName
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.fullName && touched.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="cedula">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="cedula">
                      Cédula <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="cedula"
                      placeholder="12345678"
                      className={
                        errors.cedula && touched.cedula ? "border-red-500" : ""
                      }
                    />
                    {errors.cedula && touched.cedula && (
                      <p className="text-sm text-red-500">{errors.cedula}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="phone">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Teléfono <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="+58 412-1234567"
                      className={
                        errors.phone && touched.phone ? "border-red-500" : ""
                      }
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="email">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      className={
                        errors.email && touched.email ? "border-red-500" : ""
                      }
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="address">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      {...field}
                      id="address"
                      placeholder="Calle 123, Ciudad"
                    />
                  </div>
                )}
              </Field>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.type}
                  onValueChange={(value) => setFieldValue("type", value)}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContactType.CLIENT}>Cliente</SelectItem>
                    <SelectItem value={ContactType.PROVIDER}>
                      Proveedor
                    </SelectItem>
                    <SelectItem value={ContactType.DISTRIBUTOR}>
                      Distribuidor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    ? "Actualizar Contacto"
                    : "Crear Contacto"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
