import { apiClient, handleApiError } from "./api";
import type { User, UserRole } from "@/interface/user";

export interface CreateUserDto {
  personId: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  password?: string;
  role?: UserRole;
}

export const usersService = {
  async findAll(): Promise<User[]> {
    try {
      return await apiClient.get<User[]>("/users");
    } catch (error) {
      handleApiError(error);
    }
  },

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      return await apiClient.get<User[]>(`/users?role=${role}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  async findAllWithDeleted(): Promise<User[]> {
    try {
      return await apiClient.get<User[]>("/users/with-deleted");
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

  async update(id: string, data: UpdateUserDto): Promise<User> {
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
