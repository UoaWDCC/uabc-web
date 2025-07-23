import {
  type CreateUserRequest,
  GetAllUsersResponseSchema,
  GetUserResponseSchema,
  type PaginationQuery,
  type UpdateUserRequest,
} from "@repo/shared"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminUserService = {
  /**
   * Creates a new user.
   *
   * @param data The user data to create.
   * @returns The created user.
   */
  createUser: async (data: CreateUserRequest) => {
    const response = await apiClient.post("/api/admin/users", data, GetUserResponseSchema)
    return ApiClient.throwIfError(response, "Failed to create user")
  },
  /**
   * Fetches all users.
   *
   * @param query The pagination query parameters.
   * @returns A promise that resolves to an array of users.
   */
  getPaginatedUsers: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const response = await apiClient.get(`/api/admin/users?${query}`, GetAllUsersResponseSchema)
    return ApiClient.throwIfError(response, "Failed to fetch users")
  },
  /**
   * Fetches a specific user by ID.
   *
   * @param id The user ID.
   * @returns A promise that resolves to a user.
   */
  getUser: async (id: string) => {
    const response = await apiClient.get(`/api/admin/users/${id}`, GetUserResponseSchema)
    return ApiClient.throwIfError(response, "Failed to fetch user")
  },
  /**
   * Updates a user by ID with partial user data.
   *
   * @param id The user ID.
   * @param data The user data to update.
   * @returns A promise that resolves to the updated user.
   */
  updateUser: async ({ id, userData }: { id: string; userData: UpdateUserRequest }) => {
    const response = await apiClient.patch(
      `/api/admin/users/${id}`,
      userData,
      GetUserResponseSchema,
    )
    return ApiClient.throwIfError(response, "Failed to update user")
  },
  /**
   * Deletes a user by ID.
   *
   * @param id The user ID.
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/api/admin/users/${id}`)
    return ApiClient.throwIfError(response, "Failed to delete user")
  },
} as const

export default AdminUserService
