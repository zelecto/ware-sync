/**
 * Interfaz general para la paginación (compatible con backend)
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Metadata de paginación del servidor
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Interfaz para la respuesta paginada del servidor
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Interfaz para el estado de paginación en el cliente
 */
export interface PaginationState {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Opciones de configuración para la paginación
 */
export interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  limitOptions?: number[];
}
