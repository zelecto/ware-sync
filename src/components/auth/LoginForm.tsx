import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  loginSchema,
  type LoginFormValues,
} from "@/components/auth/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function zodToFormikValidate(schema: typeof loginSchema) {
  return (values: LoginFormValues) => {
    try {
      schema.parse(values);
      return {};
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
      return errors;
    }
  };
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodToFormikValidate(loginSchema),
    onSubmit: async (values) => {
      setApiError("");
      try {
        const response = await authService.login(values);
        setUser(response.user);
        navigate("/dashboard", { replace: true });
      } catch (error) {
        if (error instanceof ApiError) {
          setApiError(error.message);
        } else {
          setApiError("Error al iniciar sesión");
        }
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6 w-sm", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <FieldGroup>
              {apiError && (
                <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
                  {apiError}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...formik.getFieldProps("email")}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? "Iniciando sesión..."
                    : "Iniciar sesión"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
