import { BaseFilterConfig } from "../config/base-filter.config";

/**
 * Configuración de filtros para la entidad Warehouse
 */
export class WarehouseFilterConfig extends BaseFilterConfig {
  constructor() {
    super();

    this.allowedFields = [
      "id",
      "name",
      "city",
      "address",
      "createdAt",
      "updatedAt",
    ];

    this.allowedSortFields = ["name", "city", "createdAt", "updatedAt"];

    this.searchableFields = ["name", "city", "address"];

    this.defaultSortField = "name";
    this.defaultSortOrder = "ASC";
  }
}
