import type {
  PaginatedResponse,
  PaginationParams,
  PaginationMeta,
} from "@/interface/pagination";

/**
 * Crea los parámetros de query string para paginación
 */
export function createPaginationQueryParams(params: PaginationParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("page", params.page.toString());
  searchParams.set("limit", params.limit.toString());
  return searchParams.toString();
}

/**
 * Calcula el offset para paginación basada en offset/limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Crea metadata de paginación
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Paginación del lado del cliente para arrays
 */
export function paginateArray<T>(
  array: T[],
  page: number,
  limit: number
): PaginatedResponse<T> {
  const offset = calculateOffset(page, limit);
  const data = array.slice(offset, offset + limit);
  const pagination = createPaginationMeta(array.length, page, limit);

  return { data, pagination };
}

/**
 * Normaliza la respuesta del backend al formato esperado
 * Si el backend devuelve un array directamente, lo convierte a formato paginado
 */
export function normalizePaginatedResponse<T>(
  response: any,
  page: number,
  limit: number
): PaginatedResponse<T> {
  // Si ya tiene el formato correcto
  if (response && response.data && response.pagination) {
    return response as PaginatedResponse<T>;
  }

  // Si es un array directamente (backend sin paginación)
  if (Array.isArray(response)) {
    return paginateArray(response, page, limit);
  }

  // Formato desconocido, devolver vacío
  console.warn("Formato de respuesta desconocido:", response);
  return {
    data: [],
    pagination: createPaginationMeta(0, page, limit),
  };
}
