import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { ContactType, type Contact } from "@/interface/contact";
import { Badge } from "../ui/badge";
import { contactsService } from "@/services/contacts.service";
import { useFilters } from "@/hooks/useFilters";
import { FilterUtils } from "@/lib/filters";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ContactTableProps {
  onEdit: (contact: Contact) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  productId?: string;
}

export function ContactTable({
  onEdit,
  searchInput,
  onSearchChange,
  productId,
}: ContactTableProps) {
  const { hasRole } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    contactId: string | null;
  }>({ open: false, contactId: null });

  const canEdit = hasRole(["ADMIN"]);

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
    limit: 10,
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

      const response = productId
        ? await contactsService.findByProductId(productId, filterParams)
        : await contactsService.findAll(filterParams);

      setContacts(response.data);
      setMeta(response.pagination);
    } catch (err: any) {
      setError(err.message || "Error al cargar contactos");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [filterParams, productId]);

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, contactId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.contactId) return;

    try {
      await contactsService.softDelete(confirmDialog.contactId);
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

  const getContactTypeBadge = () => {
    return <Badge variant="default">Proveedor</Badge>;
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
      render: () => getContactTypeBadge(),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (contact: Contact) => (
        <div className="flex justify-end gap-2">
          {canEdit && (
            <>
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
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={contacts}
        columns={columns}
        currentPage={page}
        totalPages={meta?.totalPages || 0}
        limit={limit}
        total={meta?.total || 0}
        hasNextPage={meta?.hasNextPage || false}
        hasPreviousPage={meta?.hasPreviousPage || false}
        limitOptions={[5, 10, 25, 50]}
        onPageChange={updatePage}
        onLimitChange={updateLimit}
        isLoading={loading}
        emptyMessage={
          searchInput
            ? "No se encontraron contactos con ese criterio de búsqueda"
            : "No hay contactos para mostrar"
        }
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, contactId: confirmDialog.contactId })
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar Contacto"
        description="¿Estás seguro de eliminar este contacto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </>
  );
}
