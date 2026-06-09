/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string | null;
  department?: string | null;
  location?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role?: "admin" | "partner";
  phone?: string | null;
  department?: string | null;
  location?: string | null;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: "admin" | "partner";
  status?: "active" | "inactive";
  phone?: string | null;
  department?: string | null;
  location?: string | null;
}

export interface GetUsersParams {
  name?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}

class UsersService {
  getProfile(): Promise<any> {
    return api.get("/v1/users/profile");
  }

  updateProfile(payload: UpdateProfilePayload): Promise<any> {
    return api.patch("/v1/users/profile", payload);
  }

  changePassword(payload: ChangePasswordPayload): Promise<any> {
    return api.post("/v1/users/profile/change/password", payload);
  }

  getUsers(params?: GetUsersParams): Promise<any> {
    return api.get("/v1/users", { params });
  }

  getUser(userId: string): Promise<any> {
    return api.get(`/v1/users/${userId}`);
  }

  createUser(payload: CreateUserPayload): Promise<any> {
    return api.post("/v1/users", payload);
  }

  updateUser(userId: string, payload: UpdateUserPayload): Promise<any> {
    return api.patch(`/v1/users/${userId}`, payload);
  }

  deleteUser(userId: string): Promise<any> {
    return api.delete(`/v1/users/${userId}`);
  }

  uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/v1/users/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  grantCredits(userId: string, amount: number, note?: string): Promise<any> {
    return api.post(`/v1/users/${userId}/credits`, { amount, note });
  }
}

export const usersService = new UsersService();
