import {
  type CreateUserRequest,
  GetAllUsersResponseSchema,
  GetUserResponseSchema,
  type PaginationQuery,
  type UpdateUserRequest,
} from "@repo/shared/schemas"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const AdminUserService = {
  /**
   * Creates a new user.
   *
   * @param data The user data to create.
   * @returns The created user.
   */
  createUser: async (data: CreateUserRequest) => {
    const { data: createdUser, status } = await apiClient.post(
      "/admin/users",
      data,
      GetUserResponseSchema,
    )
    if (status !== StatusCodes.CREATED) throw new Error("Failed to create user")
    return createdUser
  },
  /**
   * Fetches all users.
   *
   * @param query The pagination query parameters.
   * @returns A promise that resolves to an array of users.
   */
  getAllUsers: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const { data, status } = await apiClient.get(`/admin/users?${query}`, GetAllUsersResponseSchema)
    if (status !== StatusCodes.OK) throw new Error("Failed to fetch all users")
    return data
  },
  /**
   * Fetches a specific user by ID.
   *
   * @param id The user ID.
   * @returns A promise that resolves to a user.
   */
  getUser: async (id: string) => {
    const { data, status } = await apiClient.get(`/admin/users/${id}`, GetUserResponseSchema)
    if (status !== StatusCodes.OK) throw new Error("Failed to fetch user")
    return data
  },
  /**
   * Updates a user by ID with partial user data.
   *
   * @param id The user ID.
   * @param data The user data to update.
   * @returns A promise that resolves to the updated user.
   */
  updateUser: async (id: string, data: UpdateUserRequest) => {
    const { data: updatedUser, status } = await apiClient.patch(
      `/admin/users/${id}`,
      data,
      GetUserResponseSchema,
    )
    if (status !== StatusCodes.OK) throw new Error("Failed to update user")
    return updatedUser
  },
  /**
   * Deletes a user by ID.
   *
   * @param id The user ID.
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteUser: async (id: string) => {
    const { status } = await apiClient.delete(`/admin/users/${id}`)
    if (status !== StatusCodes.NO_CONTENT) throw new Error("Failed to delete user")
  },
} as const

export default AdminUserService
