import { apiClient, handleApiError } from "./api";
import type { Warehouse } from "@/interface/warehouse";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import { createPaginationQueryParams } from "@/lib/pagination-utils";

export interface CreateWarehouseDto {
  name: string;
  city: string;
  address: string;
}

export interface UpdateWarehouseDto {
  name?: string;
  city?: string;
  address?: string;
}

export const warehousesService = {
  async findAll(): Promise<Warehouse[]> {
    try {
      return await apiClient.get<Warehouse[]>("/warehouse");
    } catch (error) {
      handleApiError(error);
    }
  },

  async findAllPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Warehouse>> {
    try {
      const queryString = createPaginationQueryParams(params);
      return await apiClient.get<PaginatedResponse<Warehouse>>(
        `/warehouse?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findOne(id: string): Promise<Warehouse> {
    try {
      return await apiClient.get<Warehouse>(`/warehouse/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(data: CreateWarehouseDto): Promise<Warehouse> {
    try {
      return await apiClient.post<Warehouse>("/warehouse", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(id: string, data: UpdateWarehouseDto): Promise<Warehouse> {
    try {
      return await apiClient.patch<Warehouse>(`/warehouse/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/warehouse/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
