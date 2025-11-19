import { apiClient, handleApiError } from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  personId: string;
  role: string;
  person: {
    id: string;
    fullName: string;
    cedula: string;
    phone: string;
    email: string;
    address: string;
  };
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getCurrentUser(): User | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const userStr = localStorage.getItem("user");

      if (userStr) {
        return JSON.parse(userStr);
      }

      this.logout();
      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
