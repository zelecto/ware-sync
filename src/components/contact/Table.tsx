import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { ContactType, type Contact } from "@/interface/contact";
import { Badge } from "../ui/badge";
import { contactsService } from "@/services/contacts.service";
import { usePagination } from "@/hooks/usePagination";
import toast from "react-hot-toast";
import { handlePaginatedResponse } from "@/lib/pagination-helper";

interface ContactTableProps {
  filter: "ALL" | ContactType;
  onEdit: (contact: Contact) => void;
}

export function ContactTable({ filter, onEdit }: ContactTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination({
    initialLimit: 10,
  });

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Si hay filtro, usar el método sin paginación (por ahora)
      // TODO: Implementar filtro con paginación en el backend
      if (filter !== "ALL") {
        const data = await contactsService.findByType(filter);
        setContacts(data || []);
        // Simular metadata para filtros
        pagination.updateFromMeta({
          page: 1,
          limit: data.length,
          total: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } else {
        const rawResponse = await contactsService.findAllPaginated(
          pagination.paginationParams
        );
        const { data, meta } = handlePaginatedResponse<Contact>(
          rawResponse,
          pagination.currentPage,
          pagination.limit
        );
        setContacts(data);
        pagination.updateFromMeta(meta);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar contactos");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [filter, pagination.currentPage, pagination.limit]);

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

  const getContactTypeBadge = (type: ContactType) => {
    const variants: Record<ContactType, "default" | "secondary" | "outline"> = {
      [ContactType.PROVIDER]: "default",
      [ContactType.DISTRIBUTOR]: "secondary",
      [ContactType.CLIENT]: "outline",
    };

    const labels: Record<ContactType, string> = {
      [ContactType.PROVIDER]: "Proveedor",
      [ContactType.DISTRIBUTOR]: "Distribuidor",
      [ContactType.CLIENT]: "Cliente",
    };

    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadContacts}>Reintentar</Button>
      </div>
    );
  }

  const columns = [
    {
      key: "fullName",
      header: "Nombre",
      accessor: (contact: Contact) => contact.person.fullName,
    },
    {
      key: "email",
      header: "Email",
      accessor: (contact: Contact) => contact.person.email,
    },
    {
      key: "phone",
      header: "Teléfono",
      accessor: (contact: Contact) => contact.person.phone,
    },
    {
      key: "type",
      header: "Tipo",
      render: (contact: Contact) => getContactTypeBadge(contact.type),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (contact: Contact) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(contact)}
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(contact.id)}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={contacts}
      columns={columns}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      limit={pagination.limit}
      total={pagination.total}
      hasNextPage={pagination.hasNextPage}
      hasPreviousPage={pagination.hasPreviousPage}
      limitOptions={pagination.limitOptions}
      onPageChange={pagination.setPage}
      onLimitChange={pagination.setLimit}
      isLoading={loading}
      emptyMessage="No hay contactos para mostrar"
    />
  );
}
