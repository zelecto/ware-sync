import type {
  FilterParams,
  FilterCondition,
} from "../interfaces/filter.interface";
import type { BaseFilterConfig } from "../config/base-filter.config";

/**
 * Builder para construir query strings con filtros
 * Implementa el patrón Builder para construcción de URLs
 */
export class QueryStringBuilder {
  private params: URLSearchParams;
  private config: BaseFilterConfig;

  constructor(config: BaseFilterConfig) {
    this.params = new URLSearchParams();
    this.config = config;
  }

  /**
   * Aplica filtros a la query string
   */
  withFilters(filters: FilterCondition[]): this {
    filters.forEach((filter) => {
      if (this.config.isFieldAllowed(filter.field)) {
        const key = `filter[${filter.field}][${filter.operator}]`;
        const value = filter.value !== null ? String(filter.value) : "";
        this.params.append(key, value);
      }
    });
    return this;
  }

  /**
   * Aplica búsqueda a la query string
   */
  withSearch(search: string): this {
    if (search && search.trim()) {
      this.params.append("search", search.trim());
    }
    return this;
  }

  /**
   * Aplica ordenamiento a la query string
   */
  withSort(sortBy?: string, sortOrder?: string): this {
    if (sortBy && this.config.isSortFieldAllowed(sortBy)) {
      this.params.append("sortBy", sortBy);
      this.params.append(
        "sortOrder",
        sortOrder || this.config.defaultSortOrder || "ASC"
      );
    } else if (this.config.defaultSortField) {
      this.params.append("sortBy", this.config.defaultSortField);
      this.params.append("sortOrder", this.config.defaultSortOrder || "ASC");
    }
    return this;
  }

  /**
   * Aplica paginación a la query string
   */
  withPagination(page?: number, limit?: number): this {
    if (page !== undefined && page > 0) {
      this.params.append("page", String(page));
    }
    if (limit !== undefined && limit > 0) {
      this.params.append("limit", String(limit));
    }
    return this;
  }

  /**
   * Construye la query string final
   */
  build(): string {
    return this.params.toString();
  }

  /**
   * Método estático para construir query string desde FilterParams
   */
  static fromFilterParams(
    filterParams: FilterParams,
    config: BaseFilterConfig
  ): string {
    const builder = new QueryStringBuilder(config);

    if (filterParams.filters && filterParams.filters.length > 0) {
      builder.withFilters(filterParams.filters);
    }

    if (filterParams.search) {
      builder.withSearch(filterParams.search);
    }

    builder.withSort(filterParams.sortBy, filterParams.sortOrder);
    builder.withPagination(filterParams.page, filterParams.limit);

    return builder.build();
  }
}
