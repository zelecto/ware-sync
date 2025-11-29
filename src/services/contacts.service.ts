import { apiClient, handleApiError } from "./api";
import type { Contact, ContactType } from "@/interface/contact";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import { createPaginationQueryParams } from "@/lib/pagination-utils";
import {
  QueryStringBuilder,
  ContactFilterConfig,
  type FilterParams,
} from "@/lib/filters";

export interface CreateContactDto {
  personId: string;
  type: ContactType;
}

export interface CreateContactWithPersonDto {
  fullName: string;
  cedula: string;
  phone: string;
  email: string;
  address?: string;
  type: ContactType;
}

export interface UpdateContactDto {
  personId?: string;
  type?: ContactType;
}

export interface UpdateContactWithPersonDto {
  fullName: string;
  cedula: string;
  phone: string;
  email: string;
  address?: string;
  type: ContactType;
}

const contactFilterConfig = new ContactFilterConfig();

export const contactsService = {
  async findAll(
    params: PaginationParams | FilterParams
  ): Promise<PaginatedResponse<Contact>> {
    try {
      let queryString: string;

      if ("filters" in params || "search" in params || "sortBy" in params) {
        queryString = QueryStringBuilder.fromFilterParams(
          params as FilterParams,
          contactFilterConfig
        );
      } else {
        queryString = createPaginationQueryParams(params as PaginationParams);
      }

      return await apiClient.get<PaginatedResponse<Contact>>(
        `/contacts?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findByTypePaginated(
    type: ContactType,
    params: PaginationParams
  ): Promise<PaginatedResponse<Contact>> {
    try {
      const queryString = createPaginationQueryParams(params);
      return await apiClient.get<PaginatedResponse<Contact>>(
        `/contacts?type=${type}&${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findByProductId(
    productId: string,
    params: PaginationParams | FilterParams
  ): Promise<PaginatedResponse<Contact>> {
    try {
      let queryString: string;

      if ("filters" in params || "search" in params || "sortBy" in params) {
        queryString = QueryStringBuilder.fromFilterParams(
          params as FilterParams,
          contactFilterConfig
        );
      } else {
        queryString = createPaginationQueryParams(params as PaginationParams);
      }

      return await apiClient.get<PaginatedResponse<Contact>>(
        `/contacts?productId=${productId}&${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findAllWithDeletedPaginated(
    params: PaginationParams
  ): Promise<PaginatedResponse<Contact>> {
    try {
      const queryString = createPaginationQueryParams(params);
      return await apiClient.get<PaginatedResponse<Contact>>(
        `/contacts/with-deleted?${queryString}`
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  async findOne(id: string): Promise<Contact> {
    try {
      return await apiClient.get<Contact>(`/contacts/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(data: CreateContactDto): Promise<Contact> {
    try {
      return await apiClient.post<Contact>("/contacts", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async createWithPerson(data: CreateContactWithPersonDto): Promise<Contact> {
    try {
      return await apiClient.post<Contact>("/contacts", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(id: string, data: UpdateContactDto): Promise<Contact> {
    try {
      return await apiClient.patch<Contact>(`/contacts/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateWithPerson(
    id: string,
    data: UpdateContactWithPersonDto
  ): Promise<Contact> {
    try {
      return await apiClient.patch<Contact>(`/contacts/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async softDelete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/contacts/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async restore(id: string): Promise<Contact> {
    try {
      return await apiClient.patch<Contact>(`/contacts/${id}/restore`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
