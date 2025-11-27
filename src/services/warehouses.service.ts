import { apiClient, handleApiError } from "./api";
import type { Warehouse } from "@/interface/warehouse";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import { createPaginationQueryParams } from "@/lib/pagination-utils";
import {
  QueryStringBuilder,
  WarehouseFilterConfig,
  type FilterParams,
} from "@/lib/filters";

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

const warehouseFilterConfig = new WarehouseFilterConfig();

export const warehousesService = {
  async findAll(
    params: PaginationParams | FilterParams
  ): Promise<PaginatedResponse<Warehouse>> {
    try {
      let queryString: string;

      if ("filters" in params || "search" in params || "sortBy" in params) {
        queryString = QueryStringBuilder.fromFilterParams(
          params as FilterParams,
          warehouseFilterConfig
        );
      } else {
        queryString = createPaginationQueryParams(params as PaginationParams);
      }

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
