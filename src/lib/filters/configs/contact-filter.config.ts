import { BaseFilterConfig } from "../config/base-filter.config";

/**
 * Configuración de filtros para la entidad Contact
 */
export class ContactFilterConfig extends BaseFilterConfig {
  constructor() {
    super();

    this.allowedFields = [
      "id",
      "type",
      "person.fullName",
      "person.email",
      "person.cedula",
      "person.phone",
      "createdAt",
      "updatedAt",
    ];

    this.allowedSortFields = [
      "type",
      "person.fullName",
      "createdAt",
      "updatedAt",
    ];

    this.searchableFields = [
      "person.fullName",
      "person.email",
      "person.cedula",
      "person.phone",
    ];

    this.defaultSortField = "createdAt";
    this.defaultSortOrder = "DESC";
  }
}
