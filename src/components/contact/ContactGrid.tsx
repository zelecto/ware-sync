import { useEffect, useState } from "react";
import { ContactType, type Contact } from "@/interface/contact";
import { contactsService } from "@/services/contacts.service";
import { useFilters } from "@/hooks/useFilters";
import { FilterUtils } from "@/lib/filters";
import { ContactCard } from "./ContactCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ContactGridProps {
  onEdit: (contact: Contact) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export function ContactGrid({ onEdit, searchInput }: ContactGridProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const {
    filterParams,
    updateSearch,
    updatePage,
    updateLimit,
    addFilter,
    removeFilter,
    page,
    limit,
  } = useFilters({
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, updateSearch]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await contactsService.findAll(filterParams);

      setContacts(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || "Error al cargar contactos");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [filterParams]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este contacto?")) return;

    try {
      await contactsService.softDelete(id);
      toast.success("Contacto eliminado exitosamente");
      loadContacts();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar contacto";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadContacts}>Reintentar</Button>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchInput
            ? "No se encontraron contactos con ese criterio de búsqueda"
            : "No hay contactos para mostrar"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {contacts.length} de {meta.total} contactos
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePage(page - 1)}
              disabled={!meta.hasPreviousPage}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Página {page} de {meta.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePage(page + 1)}
              disabled={!meta.hasNextPage}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
