import { apiClient, handleApiError } from "./api";
import type { Contact, ContactType } from "@/interface/contact";

export interface CreateContactDto {
  personId: string;
  type: ContactType;
}

export interface UpdateContactDto {
  personId?: string;
  type?: ContactType;
}

export const contactsService = {
  async findAll(): Promise<Contact[]> {
    try {
      return await apiClient.get<Contact[]>("/contacts");
    } catch (error) {
      handleApiError(error);
    }
  },

  async findByType(type: ContactType): Promise<Contact[]> {
    try {
      return await apiClient.get<Contact[]>(`/contacts?type=${type}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async findAllWithDeleted(): Promise<Contact[]> {
    try {
      return await apiClient.get<Contact[]>("/contacts/with-deleted");
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

  async update(id: string, data: UpdateContactDto): Promise<Contact> {
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
