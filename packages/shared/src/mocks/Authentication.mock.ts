import type { AuthContextValueWithUser } from "../types/auth"
import { casualUserMock } from "./User.mock"

export const mockAuthContextValue: AuthContextValueWithUser = {
  user: casualUserMock,
  isLoading: false,
  isPending: false,
  error: null,
  token: "mock-token",
  isAvailable: true,
  login: {} as never,
  emailVerificationCode: {} as never,
  register: {} as never,
  setToken: {} as never,
  logout: {} as never,
}
