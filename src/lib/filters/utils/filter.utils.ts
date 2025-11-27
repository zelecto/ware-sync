import type { FilterCondition } from "../interfaces/filter.interface";
import type { FilterOperator } from "../types/filter-operators.type";

/**
 * Utilidades para trabajar con filtros
 */
export class FilterUtils {
  /**
   * Crea una condición de filtro
   */
  static createFilter(
    field: string,
    operator: FilterOperator,
    value: string | number | boolean | null
  ): FilterCondition {
    return { field, operator, value };
  }

  /**
   * Crea un filtro de igualdad
   */
  static equals(
    field: string,
    value: string | number | boolean
  ): FilterCondition {
    return this.createFilter(field, "eq", value);
  }

  /**
   * Crea un filtro de búsqueda (like)
   */
  static contains(field: string, value: string): FilterCondition {
    return this.createFilter(field, "like", value);
  }

  /**
   * Crea un filtro de rango (between)
   */
  static between(field: string, min: number, max: number): FilterCondition {
    return this.createFilter(field, "between", `${min},${max}`);
  }

  /**
   * Crea un filtro de lista (in)
   */
  static inList(field: string, values: (string | number)[]): FilterCondition {
    return this.createFilter(field, "in", values.join(","));
  }

  /**
   * Crea un filtro de mayor que
   */
  static greaterThan(field: string, value: number): FilterCondition {
    return this.createFilter(field, "gt", value);
  }

  /**
   * Crea un filtro de menor que
   */
  static lessThan(field: string, value: number): FilterCondition {
    return this.createFilter(field, "lt", value);
  }

  /**
   * Crea un filtro de nulo
   */
  static isNull(field: string): FilterCondition {
    return this.createFilter(field, "null", null);
  }

  /**
   * Crea un filtro de no nulo
   */
  static isNotNull(field: string): FilterCondition {
    return this.createFilter(field, "nnull", null);
  }
}
