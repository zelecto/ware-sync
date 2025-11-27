import type { FilterOperator, SortOrder } from "../types/filter-operators.type";

/**
 * Estructura de un filtro individual
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | null;
}

/**
 * Parámetros de filtrado completos
 */
export interface FilterParams {
  filters?: FilterCondition[];
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

/**
 * Configuración de filtros permitidos
 */
export interface FilterConfig {
  allowedFields: string[];
  allowedSortFields: string[];
  searchableFields: string[];
  defaultSortField?: string;
  defaultSortOrder?: SortOrder;
}
