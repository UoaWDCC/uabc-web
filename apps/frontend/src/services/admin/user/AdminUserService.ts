import {
  type CreateUserRequest,
  GetAllUsersResponseSchema,
  GetUserResponseSchema,
  type PaginationQuery,
  type UpdateUserRequest,
  UserSchema,
} from "@repo/shared"
import z from "zod"
import { ApiClient, apiClient } from "@/lib/api/client"

const AdminUserService = {
  /**
   * Creates a new user.
   *
   * @param data The user data to create.
   * @returns The created user.
   */
  createUser: async ({ data, token }: { data: CreateUserRequest; token: string | null }) => {
    const response = await apiClient.post("/api/admin/users", data, GetUserResponseSchema, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches all users.
   *
   * @param pagination The pagination query parameters.
   * @param query The search query string.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to an array of users.
   */
  getPaginatedUsers: async ({
    limit = 100,
    page,
    query = "",
    filter = "",
    token,
  }: PaginationQuery & { token: string | null }) => {
    const searchQuery = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      query: String(query),
      filter: String(filter),
    }).toString()
    const response = await apiClient.get(
      `/api/admin/users?${searchQuery}`,
      GetAllUsersResponseSchema,
      {
        requiresAuth: true,
        token,
      },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches multiple users by IDs.
   *
   * @param ids Set of IDs of users.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to an array of users.
   */
  getUsersByIds: async ({ ids, token }: { ids: Set<string>; token: string | null }) => {
    const queryParams = new URLSearchParams()
    for (const id of ids) {
      queryParams.append("id", id)
    }

    const response = await apiClient.get(
      `/api/admin/users/export?${queryParams.toString()}`,
      z.array(UserSchema),
      {
        requiresAuth: true,
        token,
      },
    )
    return ApiClient.throwIfError(response)
  },
  /**
   * Fetches a specific user by ID.
   *
   * @param id The user ID.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to a user.
   */
  getUser: async ({ id, token }: { id: string; token: string | null }) => {
    const response = await apiClient.get(`/api/admin/users/${id}`, GetUserResponseSchema, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
  /**
   * Updates a user by ID with partial user data.
   *
   * @param id The user ID.
   * @param data The user data to update.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to the updated user.
   */
  updateUser: async ({
    id,
    data,
    token,
  }: {
    id: string
    data: UpdateUserRequest
    token: string | null
  }) => {
    const response = await apiClient.patch(`/api/admin/users/${id}`, data, GetUserResponseSchema, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
  /**
   * Deletes a user by ID.
   *
   * @param id The user ID.
   * @param token The auth token to use for the request (may be null).
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteUser: async ({ id, token }: { id: string; token: string | null }) => {
    const response = await apiClient.delete(`/api/admin/users/${id}`, undefined, {
      requiresAuth: true,
      token,
    })
    return ApiClient.throwIfError(response)
  },
} as const

export default AdminUserService
