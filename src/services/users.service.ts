import { apiClient, handleApiError } from "./api";
import type { User, UserRole } from "@/interface/user";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import { createPaginationQueryParams } from "@/lib/pagination-utils";
import {
  QueryStringBuilder,
  UserFilterConfig,
  type FilterParams,
} from "@/lib/filters";

export interface CreateUserDto {
  personId: string;
  password: string;
  role: UserRole;
}

export interface CreateUserWithPersonDto {
  fullName: string;
  cedula: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  password?: string;
  role?: UserRole;
}

export interface UpdateUserWithPersonDto {
  fullName: string;
  cedula: string;
  phone: string;
  email: string;
  address?: string;
  password?: string;
  role: UserRole;
}

// Configuración de filtros para usuarios
const userFilterConfig = new UserFilterConfig();

export const usersService = {
  /**
   * Obtiene usuarios con filtros, búsqueda, ordenamiento y paginación
   * Método principal que soporta tanto paginación simple como filtros avanzados
   */
  async findAll(
    params: PaginationParams | FilterParams
  ): Promise<PaginatedResponse<User>> {
    try {
      let queryString: string;

      // Si tiene filtros, usar QueryStringBuilder
      if ("filters" in params || "search" in params || "sortBy" in params) {
        queryString = QueryStringBuilder.fromFilterParams(
          params as FilterParams,
          userFilterConfig
        );
      } else {
        // Paginación simple
        queryString = createPaginationQueryParams(params as PaginationParams);
      }

      return await apiClient.get<PaginatedResponse<User>>(
        `/users?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findByRolePaginated(
    role: UserRole,
    params: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    try {
      const queryString = createPaginationQueryParams(params);
      return await apiClient.get<PaginatedResponse<User>>(
        `/users?role=${role}&${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findAllWithDeletedPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    try {
      const queryString = createPaginationQueryParams(params);
      return await apiClient.get<PaginatedResponse<User>>(
        `/users/with-deleted?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findOne(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(data: CreateUserDto): Promise<User> {
    try {
      return await apiClient.post<User>("/users", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createWithPerson(data: CreateUserWithPersonDto): Promise<User> {
    try {
      return await apiClient.post<User>("/users", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await apiClient.patch<User>(`/users/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateWithPerson(
    id: string,
    data: UpdateUserWithPersonDto
  ): Promise<User> {
    try {
      return await apiClient.patch<User>(`/users/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async softDelete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async restore(id: string): Promise<User> {
    try {
      return await apiClient.patch<User>(`/users/${id}/restore`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
