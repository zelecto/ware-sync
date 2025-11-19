import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  contactsService,
  type CreateContactWithPersonDto,
  type UpdateContactWithPersonDto,
} from "@/services/contacts.service";

export default function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: CreateContactWithPersonDto | UpdateContactWithPersonDto
  ) => {
    try {
      setLoading(true);
      await contactsService.createWithPerson(
        values as CreateContactWithPersonDto
      );
      toast.success("Contacto creado exitosamente");
      navigate("/contacts");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear el contacto";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/contacts");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Contacto</h1>

      <ContactForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
