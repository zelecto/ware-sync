/**
 * Operadores disponibles para filtros
 */
export type FilterOperator =
  | "eq" // Igual
  | "ne" // No igual
  | "gt" // Mayor que
  | "gte" // Mayor o igual
  | "lt" // Menor que
  | "lte" // Menor o igual
  | "like" // Contiene
  | "in" // En lista
  | "nin" // No en lista
  | "null" // Es nulo
  | "nnull" // No es nulo
  | "between"; // Entre dos valores

/**
 * Orden de clasificación
 */
export type SortOrder = "ASC" | "DESC";
