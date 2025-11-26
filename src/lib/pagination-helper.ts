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
): { data: T[]; meta: PaginationMeta | undefined } {
  // Si la respuesta es null o undefined
  if (!response) {
    return {
      data: [],
      meta: createPaginationMeta(0, page, limit),
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
      meta: response.pagination, // El backend usa "pagination" en lugar de "meta"
    };
  }

  // Si tiene el formato { data, meta }
  if (
    typeof response === "object" &&
    "data" in response &&
    "meta" in response
  ) {
    return {
      data: response.data || [],
      meta: response.meta,
    };
  }

  // Si es un array directamente (backend sin paginación implementada aún)
  if (Array.isArray(response)) {
    return {
      data: response,
      meta: createPaginationMeta(response.length, page, limit),
    };
  }

  // Formato desconocido
  console.warn("Formato de respuesta desconocido:", response);
  return {
    data: [],
    meta: createPaginationMeta(0, page, limit),
  };
}
