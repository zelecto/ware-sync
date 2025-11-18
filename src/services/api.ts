import ApiClient from "@/lib/api/apiClient";
import { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// Instancia del cliente API
export const apiClient = ApiClient.getInstance();

// Helper para manejar errores de Axios
export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    const data = error.response?.data;
    throw new ApiError(message, status, data);
  }

  throw new ApiError(
    error instanceof Error ? error.message : "Error de conexión"
  );
}
