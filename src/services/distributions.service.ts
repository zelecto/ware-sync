import { apiClient, handleApiError } from "./api";
import type { Distribution } from "@/interface/distribution";

export interface CreateDistributionDto {
  originWarehouseId: string;
  destinationWarehouseId?: string;
  contactId?: string;
  details: Array<{
    productId: string;
    amount: number;
  }>;
}

export interface UpdateDistributionDto {
  originWarehouseId?: string;
  destinationWarehouseId?: string;
  contactId?: string;
}

export const distributionsService = {
  async findAll(): Promise<Distribution[]> {
    try {
      return await apiClient.get<Distribution[]>("/distribution");
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

  async create(data: CreateDistributionDto): Promise<Distribution> {
    try {
      return await apiClient.post<Distribution>("/distribution", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(id: string, data: UpdateDistributionDto): Promise<Distribution> {
    try {
      return await apiClient.patch<Distribution>(`/distribution/${id}`, data);
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
