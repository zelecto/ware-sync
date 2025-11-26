import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  contactsService,
  type UpdateContactWithPersonDto,
} from "@/services/contacts.service";
import type { Contact } from "@/interface/contact";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingContact, setLoadingContact] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);

  // Actualizar breadcrumb con el nombre del contacto
  useBreadcrumbItem(contact?.person.fullName || "Editar");

  useEffect(() => {
    const loadContact = async () => {
      if (!id) {
        toast.error("ID de contacto no válido");
        navigate("/contacts");
        return;
      }

      try {
        setLoadingContact(true);
        const contactData = await contactsService.findOne(id);
        setContact(contactData);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al cargar el contacto";
        toast.error(errorMessage);
        navigate("/contacts");
      } finally {
        setLoadingContact(false);
      }
    };

    loadContact();
  }, [id, navigate]);

  const handleSubmit = async (values: UpdateContactWithPersonDto) => {
    if (!id) return;

    try {
      setLoading(true);
      await contactsService.updateWithPerson(id, values);
      toast.success("Contacto actualizado exitosamente");
      navigate("/contacts");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar el contacto";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/contacts");
  };

  if (loadingContact) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">Cargando contacto...</div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Editar Contacto</h1>

      <ContactForm
        contact={contact}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
