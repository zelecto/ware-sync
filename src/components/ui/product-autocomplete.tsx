import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Product } from "@/interface/product";

interface ProductAutocompleteProps {
  products: Product[];
  value?: string;
  onChange: (productId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showStock?: boolean;
  warehouseId?: string;
}

export function ProductAutocomplete({
  products,
  value,
  onChange,
  placeholder = "Buscar por código o nombre...",
  disabled = false,
  className,
  showStock = false,
  warehouseId,
}: ProductAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const product = products.find((p) => p.id === value);
      if (product) {
        setDisplayValue(`${product.name} (${product.sku})`);
        setSearchTerm("");
      }
    } else {
      setDisplayValue("");
      setSearchTerm("");
    }
  }, [value, products]);

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

  const filteredProducts = products.filter((product) => {
    const search = (searchTerm || displayValue).toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search)
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

  const handleSelectProduct = (product: Product) => {
    onChange(product.id);
    setDisplayValue(`${product.name} (${product.sku})`);
    setSearchTerm("");
    setIsOpen(false);
  };

  const getProductStock = (product: Product) => {
    if (!showStock || !warehouseId) return null;
    const warehouseProduct = product.warehouses?.find(
      (wp) => wp.warehouseId === warehouseId
    );
    return warehouseProduct?.quantity || 0;
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

      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {filteredProducts.map((product) => {
            const stock = getProductStock(product);
            return (
              <button
                key={product.id}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm border-b last:border-b-0"
                onClick={() => handleSelectProduct(product)}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">
                    {product.name}{" "}
                    <span className="text-muted-foreground">
                      ({product.sku})
                    </span>
                  </span>
                  {showStock && stock !== null && (
                    <span className="text-xs text-muted-foreground ml-2">
                      Stock: {stock}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {isOpen &&
        filteredProducts.length === 0 &&
        (searchTerm || displayValue) && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md p-3">
            <p className="text-sm text-muted-foreground">
              No se encontraron productos
            </p>
          </div>
        )}
    </div>
  );
}
