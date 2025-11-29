import type { PaginatedResponse, PaginationMeta } from "@/interface/pagination";
import { createPaginationMeta } from "./pagination-utils";

/**
 * Helper para manejar respuestas de paginación del backend
 * Normaliza diferentes formatos de respuesta
 */
export function handlePaginatedResponse<T>(
  response: any,
  page: number,
  limit: number
): { data: T[]; pagination: PaginationMeta | undefined } {
  // Si la respuesta es null o undefined
  if (!response) {
    return {
      data: [],
      pagination: createPaginationMeta(0, page, limit),
    };
  }

  // Si tiene el formato { data, pagination } (formato del backend)
  if (
    typeof response === "object" &&
    "data" in response &&
    "pagination" in response
  ) {
    return {
      data: response.data || [],
      pagination: response.pagination,
    };
  }

  // Si es un array directamente (backend sin paginación implementada aún)
  if (Array.isArray(response)) {
    return {
      data: response,
      pagination: createPaginationMeta(response.length, page, limit),
    };
  }

  // Formato desconocido
  console.warn("Formato de respuesta desconocido:", response);
  return {
    data: [],
    pagination: createPaginationMeta(0, page, limit),
  };
}
