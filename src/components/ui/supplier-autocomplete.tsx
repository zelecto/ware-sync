import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Contact } from "@/interface/contact";

interface SupplierAutocompleteProps {
  suppliers: Contact[];
  value?: string;
  onChange: (supplierId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SupplierAutocomplete({
  suppliers,
  value,
  onChange,
  placeholder = "Buscar proveedor...",
  disabled = false,
  className,
}: SupplierAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const supplier = suppliers.find((s) => s.id === value);
      if (supplier) {
        setDisplayValue(supplier.person.fullName);
        setSearchTerm("");
      }
    } else {
      setDisplayValue("");
      setSearchTerm("");
    }
  }, [value, suppliers]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (!value) {
          setSearchTerm("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const search = (searchTerm || displayValue).toLowerCase();
    return (
      supplier.person.fullName.toLowerCase().includes(search) ||
      supplier.person.cedula.toLowerCase().includes(search) ||
      supplier.person.phone.toLowerCase().includes(search) ||
      (supplier.person.email &&
        supplier.person.email.toLowerCase().includes(search))
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setDisplayValue(newValue);
    setIsOpen(true);

    // Si se borra el input, limpiar la selección
    if (!newValue) {
      onChange("");
    }
  };

  const handleSelectSupplier = (supplier: Contact) => {
    onChange(supplier.id);
    setDisplayValue(supplier.person.fullName);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-9"
        autoComplete="off"
      />

      {isOpen && filteredSuppliers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {filteredSuppliers.map((supplier) => (
            <button
              key={supplier.id}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm border-b last:border-b-0"
              onClick={() => handleSelectSupplier(supplier)}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{supplier.person.fullName}</span>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Cédula: {supplier.person.cedula}</span>
                  <span>Tel: {supplier.person.phone}</span>
                  {supplier.person.email && (
                    <span>Email: {supplier.person.email}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen &&
        filteredSuppliers.length === 0 &&
        (searchTerm || displayValue) && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md p-3">
            <p className="text-sm text-muted-foreground">
              No se encontraron proveedores
            </p>
          </div>
        )}
    </div>
  );
}
