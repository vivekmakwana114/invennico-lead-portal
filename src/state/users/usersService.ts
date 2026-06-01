import { api } from "@/lib/api";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  avatar?: string;
}

/**
 * Service to handle User management and profile API calls using the shared Axios client.
 */
class UsersService {
  /**
   * Get all users
   * GET {{baseUrl}}/users
   */
  async getUsers(): Promise<any> {
    return api.get(`/users`);
  }

  /**
   * Get user profile details
   * GET {{baseUrl}}/users/profile
   */
  async getProfile(): Promise<any> {
    return api.get(`/users/profile`);
  }

  /**
   * Update profile details
   * PUT {{baseUrl}}/users/profile
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<any> {
    return api.put(`/users/profile`, payload);
  }
}

export const usersService = new UsersService();
