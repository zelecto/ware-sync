import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ProductForm } from "@/components/product";
import { productsService } from "@/services/products.service";
import type {
  CreateProductDto,
  UpdateProductDto,
} from "@/services/products.service";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateProductDto | UpdateProductDto) => {
    try {
      setLoading(true);
      await productsService.create(values as CreateProductDto);
      toast.success("Producto creado exitosamente");
      navigate("/products");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al crear el producto";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div>
      <div className="mb-6"></div>
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
