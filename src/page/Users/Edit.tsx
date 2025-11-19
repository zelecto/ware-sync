import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UserForm } from "@/components/user/UserForm";
import {
  usersService,
  type UpdateUserWithPersonDto,
} from "@/services/users.service";
import type { User } from "@/interface/user";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        toast.error("ID de usuario no válido");
        navigate("/users");
        return;
      }

      try {
        setLoadingUser(true);
        const userData = await usersService.findOne(id);
        setUser(userData);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al cargar el usuario";
        toast.error(errorMessage);
        navigate("/users");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  const handleSubmit = async (values: UpdateUserWithPersonDto) => {
    if (!id) return;

    try {
      setLoading(true);
      await usersService.updateWithPerson(id, values);
      toast.success("Usuario actualizado exitosamente");
      navigate("/users");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar el usuario";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (loadingUser) {
    return (
      <div className="max-w-lg">
        <div className="text-center py-8">Cargando usuario...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Editar Usuario</h1>

      <UserForm
        user={user}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
