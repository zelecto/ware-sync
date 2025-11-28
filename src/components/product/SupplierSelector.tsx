import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { contactsService } from "@/services/contacts.service";
import { ContactType, type Contact } from "@/interface/contact";

interface SupplierSelectorProps {
  selectedSupplierIds: string[];
  onAddSupplier: (supplierId: string) => void;
  onRemoveSupplier: (supplierId: string) => void;
  error?: string;
}

export function SupplierSelector({
  selectedSupplierIds,
  onAddSupplier,
  onRemoveSupplier,
  error,
}: SupplierSelectorProps) {
  const [suppliers, setSuppliers] = useState<Contact[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await contactsService.findByTypePaginated(
          ContactType.PROVIDER,
          { page: 1, limit: 100 }
        );
        // Filtrar solo los contactos que sean de tipo PROVIDER
        const providers = response.data.filter(
          (contact) => contact.type === ContactType.PROVIDER
        );
        setSuppliers(providers);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    loadSuppliers();
  }, []);

  const handleAddSupplier = () => {
    if (
      selectedSupplierId &&
      !selectedSupplierIds.includes(selectedSupplierId)
    ) {
      onAddSupplier(selectedSupplierId);
      setSelectedSupplierId("");
    }
  };

  const availableSuppliers = suppliers.filter(
    (s) => !selectedSupplierIds.includes(s.id)
  );

  const selectedSuppliers = suppliers.filter((s) =>
    selectedSupplierIds.includes(s.id)
  );

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Add Supplier */}
      {availableSuppliers.length > 0 && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Agregar Proveedor
          </Label>
          <div className="flex gap-2">
            <Select
              value={selectedSupplierId}
              onValueChange={setSelectedSupplierId}
              disabled={loadingSuppliers || availableSuppliers.length === 0}
            >
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={
                    loadingSuppliers
                      ? "Cargando proveedores..."
                      : availableSuppliers.length === 0
                      ? "No hay proveedores disponibles"
                      : "Selecciona un proveedor"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableSuppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.person.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddSupplier}
              disabled={!selectedSupplierId}
              size="sm"
            >
              Agregar
            </Button>
          </div>
        </div>
      )}

      {/* Selected Suppliers */}
      {selectedSuppliers.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Proveedores Seleccionados
          </Label>
          <div className="space-y-2">
            {selectedSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(supplier.person.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {supplier.person.fullName}
                  </p>
                  {supplier.person.email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {supplier.person.email}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveSupplier(supplier.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSuppliers.length === 0 && (
        <div className="rounded-lg border border-dashed py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No has seleccionado ningún proveedor
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
