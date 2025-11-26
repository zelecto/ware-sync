import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { DistributionForm } from "@/components/distribution";
import { distributionsService } from "@/services/distributions.service";
import { warehousesService } from "@/services/warehouses.service";
import { contactsService } from "@/services/contacts.service";
import { productsService } from "@/services/products.service";
import type { CreateDistributionDto } from "@/services/distributions.service";
import type { Warehouse } from "@/interface/warehouse";
import type { Contact } from "@/interface/contact";
import type { Product } from "@/interface/product";

export default function CreateDistribution() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const [warehousesResponse, contactsResponse, productsResponse] =
          await Promise.all([
            warehousesService.findAllPaginated({ page: 1, limit: 50 }),
            contactsService.findAllPaginated({ page: 1, limit: 50 }),
            productsService.findAllPaginated({ page: 1, limit: 50 }),
          ]);
        setWarehouses(warehousesResponse.data);
        setContacts(contactsResponse.data);
        setProducts(productsResponse.data);
      } catch (error: any) {
        toast.error("Error al cargar los datos");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (values: CreateDistributionDto) => {
    try {
      setLoading(true);
      await distributionsService.create(values);
      toast.success("Distribución creada exitosamente");
      navigate("/distributions");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear la distribución";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/distributions");
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
        <h1 className="text-2xl font-bold">Crear Distribución</h1>
      </div>
      <DistributionForm
        warehouses={warehouses}
        contacts={contacts}
        products={products}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
