import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ProductForm } from "@/components/product";
import { productsService } from "@/services/products.service";
import type { Product } from "@/interface/product";
import type { UpdateProductDto } from "@/services/products.service";
import { useBreadcrumbItem } from "@/hooks/useBreadcrumbItem";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Actualizar breadcrumb con el nombre del producto
  useBreadcrumbItem(product?.name || "Editar");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await productsService.findOne(id);
        setProduct(data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al cargar el producto";
        toast.error(errorMessage);
        navigate("/products");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (values: UpdateProductDto) => {
    if (!id) return;
    try {
      setLoading(true);
      await productsService.update(id, values);
      toast.success("Producto actualizado exitosamente");
      navigate("/products");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar el producto";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loadingProduct) {
    return <div className="text-center py-8">Cargando producto...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Producto no encontrado</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Producto</h1>
      </div>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
