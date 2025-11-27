// Exportar tipos
export type { FilterOperator, SortOrder } from "./types/filter-operators.type";

// Exportar interfaces
export type {
  FilterCondition,
  FilterParams,
  FilterConfig,
} from "./interfaces/filter.interface";

// Exportar configuración base
export { BaseFilterConfig } from "./config/base-filter.config";

// Exportar builders
export { QueryStringBuilder } from "./builders/query-string.builder";

// Exportar utilidades
export { FilterUtils } from "./utils/filter.utils";

// Exportar configuraciones específicas
export { UserFilterConfig } from "./configs/user-filter.config";
export { ContactFilterConfig } from "./configs/contact-filter.config";
export { ProductFilterConfig } from "./configs/product-filter.config";
export { WarehouseFilterConfig } from "./configs/warehouse-filter.config";
