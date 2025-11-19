import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserForm } from "@/components/user/UserForm";
import {
  usersService,
  type CreateUserWithPersonDto,
  type UpdateUserWithPersonDto,
} from "@/services/users.service";

export default function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: CreateUserWithPersonDto | UpdateUserWithPersonDto
  ) => {
    try {
      setLoading(true);
      await usersService.createWithPerson(values as CreateUserWithPersonDto);
      toast.success("Usuario creado exitosamente");
      navigate("/users");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear el usuario";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Usuario</h1>

      <UserForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
