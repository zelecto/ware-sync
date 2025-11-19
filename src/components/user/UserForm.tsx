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
import { UserRole, type User } from "@/interface/user";
import type {
  CreateUserWithPersonDto,
  UpdateUserWithPersonDto,
} from "@/services/users.service";

const createUserSchema = z
  .object({
    fullName: z.string().min(1, "El nombre completo es requerido"),
    cedula: z.string().min(1, "La cédula es requerida"),
    phone: z.string().min(1, "El teléfono es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("El correo electrónico no es válido"),
    address: z.string().optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    role: z.enum([UserRole.ADMIN, UserRole.WORKER]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const updateUserSchema = z
  .object({
    fullName: z.string().min(1, "El nombre completo es requerido"),
    cedula: z.string().min(1, "La cédula es requerida"),
    phone: z.string().min(1, "El teléfono es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("El correo electrónico no es válido"),
    address: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.WORKER]),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "La contraseña debe tener al menos 6 caracteres",
      path: ["password"],
    }
  );

type UserFormValues = {
  fullName: string;
  cedula: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

interface UserFormProps {
  user?: User;
  onSubmit: (
    values: CreateUserWithPersonDto | UpdateUserWithPersonDto
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function UserForm({
  user,
  onSubmit,
  onCancel,
  loading = false,
}: UserFormProps) {
  const isEditMode = !!user;

  const initialValues: UserFormValues = {
    fullName: user?.person.fullName || "",
    cedula: user?.person.cedula || "",
    phone: user?.person.phone || "",
    email: user?.person.email || "",
    address: user?.person.address || "",
    password: "",
    confirmPassword: "",
    role: user?.role || UserRole.WORKER,
  };

  const validate = (values: UserFormValues) => {
    try {
      if (isEditMode) {
        updateUserSchema.parse(values);
      } else {
        createUserSchema.parse(values);
      }
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

  const handleSubmit = async (values: UserFormValues) => {
    const { confirmPassword, password, ...userData } = values;

    if (isEditMode) {
      // En modo edición, solo incluir password si se proporcionó
      const updateData: UpdateUserWithPersonDto = {
        ...userData,
        ...(password ? { password } : {}),
      };
      await onSubmit(updateData);
    } else {
      // En modo creación, password es requerido
      await onSubmit({ ...userData, password });
    }
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
                {isEditMode ? "Editar Usuario" : "Información del Usuario"}
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

              <Field name="password">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Contraseña{" "}
                      {!isEditMode && <span className="text-red-500">*</span>}
                      {isEditMode && (
                        <span className="text-sm text-gray-500 font-normal">
                          (dejar en blanco para no cambiar)
                        </span>
                      )}
                    </Label>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder={
                        isEditMode
                          ? "Dejar en blanco para no cambiar"
                          : "Mínimo 6 caracteres"
                      }
                      className={
                        errors.password && touched.password
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.password && touched.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field }: FieldProps) => (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Contraseña{" "}
                      {!isEditMode && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="Repite la contraseña"
                      className={
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.role}
                  onValueChange={(value) => setFieldValue("role", value)}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.WORKER}>Trabajador</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>
                      Administrador
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
                    ? "Actualizar Usuario"
                    : "Crear Usuario"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
