import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SupplierInboundForm } from "@/components/distribution";
import { distributionsService } from "@/services/distributions.service";
import { warehousesService } from "@/services/warehouses.service";
import { contactsService } from "@/services/contacts.service";
import { productsService } from "@/services/products.service";
import type { CreateSupplierInboundDto } from "@/services/distributions.service";
import type { Warehouse } from "@/interface/warehouse";
import type { Contact } from "@/interface/contact";
import type { Product } from "@/interface/product";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function CreateSupplierInbound() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [preselectedProductId, setPreselectedProductId] = useState<
    string | null
  >(null);
  const [preselectedWarehouseId, setPreselectedWarehouseId] = useState<
    string | null
  >(null);

  useBreadcrumbItem("Crear Entrada");

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const [warehousesResponse, suppliersResponse, productsResponse] =
          await Promise.all([
            warehousesService.findAll({ page: 1, limit: 100 }),
            contactsService.findAll({ page: 1, limit: 100 }),
            productsService.findAll({ page: 1, limit: 100 }),
          ]);
        setWarehouses(warehousesResponse.data);
        setSuppliers(suppliersResponse.data);
        setProducts(productsResponse.data);

        // Leer parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);

        // Buscar producto por SKU
        const sku = urlParams.get("sku");
        if (sku && productsResponse.data.length > 0) {
          const product = productsResponse.data.find((p) => p.sku === sku);
          if (product) {
            setPreselectedProductId(product.id);
          }
        }

        // Buscar bodega por nombre
        const warehouseName = urlParams.get("warehouse");
        if (warehouseName && warehousesResponse.data.length > 0) {
          const warehouse = warehousesResponse.data.find(
            (w) => w.name === warehouseName
          );
          if (warehouse) {
            setPreselectedWarehouseId(warehouse.id);
          }
        }
      } catch (error: any) {
        toast.error("Error al cargar los datos");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (values: CreateSupplierInboundDto) => {
    try {
      setLoading(true);
      await distributionsService.createSupplierInbound(values);
      toast.success("Entrada creada exitosamente");
      navigate("/distributions/inbound");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear la entrada";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/distributions/inbound");
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear Entrada desde Proveedor</h1>
        <p className="text-muted-foreground">
          Registre la entrada de productos desde un proveedor
        </p>
      </div>
      <SupplierInboundForm
        warehouses={warehouses}
        suppliers={suppliers}
        products={products}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        preselectedProductId={preselectedProductId}
        preselectedWarehouseId={preselectedWarehouseId}
      />
    </div>
  );
}
