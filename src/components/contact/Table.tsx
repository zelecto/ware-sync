import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ContactType, type Contact } from "@/interface/contact";
import { Badge } from "../ui/badge";
import { contactsService } from "@/services/contacts.service";

interface ContactTableProps {
  filter: "ALL" | ContactType;
  onEdit: (contact: Contact) => void;
}

export function ContactTable({ filter, onEdit }: ContactTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data =
        filter === "ALL"
          ? await contactsService.findAll()
          : await contactsService.findByType(filter);
      setContacts(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar contactos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este contacto?")) return;

    try {
      await contactsService.softDelete(id);
      loadContacts();
    } catch (err: any) {
      alert(err.message || "Error al eliminar contacto");
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

  if (loading) {
    return <div className="text-center py-8">Cargando contactos...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={loadContacts}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No hay contactos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  {contact.person.fullName}
                </TableCell>
                <TableCell>{contact.person.email}</TableCell>
                <TableCell>{contact.person.phone}</TableCell>
                <TableCell>{getContactTypeBadge(contact.type)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contact)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
