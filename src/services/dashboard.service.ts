import { apiClient, handleApiError } from "./api";

export interface DashboardData {
  totalProducts: number;
  totalWarehouses: number;
  lowStockProducts: number;
  pendingDistributions: number;
  totalInventoryValue: string;
  distributions: {
    pending: number;
    completed: number;
    cancelled: number;
  };
  topProducts: Array<{
    name: string;
    sku: string;
    distributed: number;
    unit: string;
  }>;
  criticalStock: Array<{
    name: string;
    sku: string;
    current: number;
    min: number;
    warehouse: string;
  }>;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      return await apiClient.get<DashboardData>("/dashboard");
    } catch (error) {
      handleApiError(error);
    }
  },
};
