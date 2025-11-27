import { apiClient, handleApiError } from "./api";
import type { Product, ProductUnit } from "@/interface/product";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import { createPaginationQueryParams } from "@/lib/pagination-utils";
import {
  QueryStringBuilder,
  ProductFilterConfig,
  type FilterParams,
} from "@/lib/filters";

export interface CreateProductDto {
  sku: string;
  name: string;
  unit?: ProductUnit;
  unitDescription?: string;
  purchasePrice: string;
  minStock?: number;
  isActive?: boolean;
  imageUrl?: string;
  warehouses: Array<{
    warehouseId: string;
    initialQuantity: number;
  }>;
}

export interface UpdateProductDto {
  sku?: string;
  name?: string;
  unit?: ProductUnit;
  unitDescription?: string;
  purchasePrice?: string;
  minStock?: number;
  isActive?: boolean;
  imageUrl?: string;
  warehouses?: Array<{
    warehouseId: string;
    initialQuantity: number;
  }>;
}

const productFilterConfig = new ProductFilterConfig();

export const productsService = {
  async findAll(
    params: PaginationParams | FilterParams
  ): Promise<PaginatedResponse<Product>> {
    try {
      let queryString: string;

      if ("filters" in params || "search" in params || "sortBy" in params) {
        queryString = QueryStringBuilder.fromFilterParams(
          params as FilterParams,
          productFilterConfig
        );
      } else {
        queryString = createPaginationQueryParams(params as PaginationParams);
      }

      return await apiClient.get<PaginatedResponse<Product>>(
        `/product?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findOne(id: string): Promise<Product> {
    try {
      return await apiClient.get<Product>(`/product/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(data: CreateProductDto): Promise<Product> {
    try {
      return await apiClient.post<Product>("/product", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      return await apiClient.patch<Product>(`/product/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/product/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
