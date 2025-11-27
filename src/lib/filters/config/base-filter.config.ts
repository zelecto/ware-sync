import type { FilterConfig } from "../interfaces/filter.interface";
import type { SortOrder } from "../types/filter-operators.type";

/**
 * Configuración base para filtros
 * Implementa el patrón Template Method para configuración de filtros
 */
export abstract class BaseFilterConfig implements FilterConfig {
  allowedFields: string[] = [];
  allowedSortFields: string[] = [];
  searchableFields: string[] = [];
  defaultSortField?: string;
  defaultSortOrder?: SortOrder = "ASC";

  /**
   * Valida si un campo está permitido para filtrado
   */
  isFieldAllowed(field: string): boolean {
    return this.allowedFields.includes(field);
  }

  /**
   * Valida si un campo está permitido para ordenamiento
   */
  isSortFieldAllowed(field: string): boolean {
    return this.allowedSortFields.includes(field);
  }

  /**
   * Valida si un campo es buscable
   */
  isSearchableField(field: string): boolean {
    return this.searchableFields.includes(field);
  }
}
