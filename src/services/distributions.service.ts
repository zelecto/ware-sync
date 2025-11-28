import { apiClient, handleApiError } from "./api";
import type { Distribution } from "@/interface/distribution";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import { createPaginationQueryParams } from "@/lib/pagination-utils";

export interface CreateWarehouseTransferDto {
  originWarehouseId: string;
  destinationWarehouseId: string;
  details: Array<{
    productId: string;
    amount: number;
  }>;
}

export interface CreateSupplierInboundDto {
  contactId: string;
  destinationWarehouseId: string;
  details: Array<{
    productId: string;
    amount: number;
  }>;
}

export const distributionsService = {
  async findAllPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Distribution>> {
    try {
      const queryString = createPaginationQueryParams(params);
      return await apiClient.get<PaginatedResponse<Distribution>>(
        `/distribution?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findOne(id: string): Promise<Distribution> {
    try {
      return await apiClient.get<Distribution>(`/distribution/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createWarehouseTransfer(
    data: CreateWarehouseTransferDto
  ): Promise<Distribution> {
    try {
      return await apiClient.post<Distribution>(
        "/distribution/warehouse-transfer",
        data
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async createSupplierInbound(
    data: CreateSupplierInboundDto
  ): Promise<Distribution> {
    try {
      return await apiClient.post<Distribution>(
        "/distribution/supplier-inbound",
        data
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async complete(id: string): Promise<Distribution> {
    try {
      return await apiClient.post<Distribution>(`/distribution/${id}/complete`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async cancel(id: string): Promise<Distribution> {
    try {
      return await apiClient.post<Distribution>(`/distribution/${id}/cancel`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/distribution/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
