import { BaseFilterConfig } from "../config/base-filter.config";

/**
 * Configuración de filtros para la entidad User
 * Define qué campos pueden ser filtrados, ordenados y buscados
 */
export class UserFilterConfig extends BaseFilterConfig {
  constructor() {
    super();

    // Campos permitidos para filtrado
    this.allowedFields = [
      "personId",
      "role",
      "person.fullName",
      "person.cedula",
      "person.email",
      "person.phone",
      "createdAt",
      "updatedAt",
    ];

    // Campos permitidos para ordenamiento
    this.allowedSortFields = [
      "personId",
      "role",
      "person.fullName",
      "person.cedula",
      "createdAt",
      "updatedAt",
    ];

    // Campos en los que se puede buscar
    this.searchableFields = [
      "person.fullName",
      "person.cedula",
      "person.email",
      "person.phone",
    ];

    // Configuración por defecto
    this.defaultSortField = "createdAt";
    this.defaultSortOrder = "DESC";
  }
}
