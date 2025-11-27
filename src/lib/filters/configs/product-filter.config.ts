import { BaseFilterConfig } from "../config/base-filter.config";

/**
 * Configuración de filtros para la entidad Product
 */
export class ProductFilterConfig extends BaseFilterConfig {
  constructor() {
    super();

    this.allowedFields = [
      "id",
      "sku",
      "name",
      "unit",
      "purchasePrice",
      "minStock",
      "isActive",
      "createdAt",
      "updatedAt",
    ];

    this.allowedSortFields = [
      "name",
      "sku",
      "purchasePrice",
      "minStock",
      "createdAt",
      "updatedAt",
    ];

    this.searchableFields = ["name", "sku", "unitDescription"];

    this.defaultSortField = "name";
    this.defaultSortOrder = "ASC";
  }
}
