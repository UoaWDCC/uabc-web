import {
  GetAllUsersResponseSchema,
  GetUserResponseSchema,
  type PaginationQuery,
  type UpdateUserRequest,
} from "@repo/shared/schemas"
import { StatusCodes } from "http-status-codes"
import { apiClient } from "@/lib/api/client"

const AdminUserService = {
  /**
   * The getUsers function fetches all users from the admin API.
   *
   * @param query The pagination query parameters.
   * @returns A promise that resolves to an array of users.
   */
  getUsers: async ({ limit = 100, page }: PaginationQuery) => {
    const query = new URLSearchParams({ limit: String(limit), page: String(page) }).toString()
    const { data } = await apiClient.get(`/admin/users?${query}`, GetAllUsersResponseSchema)
    if (!data) throw new Error("Failed to fetch all users")
    return data
  },
  /**
   * The getUser function fetches a user from the admin API.
   *
   * @param id The user ID.
   * @returns A promise that resolves to a user.
   */
  getUser: async (id: string) => {
    const { data } = await apiClient.get(`/admin/users/${id}`, GetUserResponseSchema)
    if (!data) throw new Error("Failed to fetch user")
    return data
  },
  /**
   * The updateUser function updates a user in the admin API.
   *
   * @param id The user ID.
   * @param data The user data to update.
   * @returns A promise that resolves to the updated user.
   */
  updateUser: async (id: string, data: UpdateUserRequest) => {
    const { data: updatedUser } = await apiClient.patch(
      `/admin/users/${id}`,
      data,
      GetUserResponseSchema,
    )
    if (!updatedUser) throw new Error("Failed to update user")
    return updatedUser
  },
  /**
   * The deleteUser function deletes a user from the admin API.
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
