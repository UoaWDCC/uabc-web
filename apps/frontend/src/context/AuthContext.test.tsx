import { AUTH_COOKIE_NAME } from "@repo/shared"
import { render, renderHook, screen, waitFor } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import userEvent from "@testing-library/user-event"
import { StatusCodes } from "http-status-codes"
import { ApiClientError } from "@/lib/api/ApiClientError"
import AuthService from "@/services/auth/AuthService"
import { AuthProvider, useAuth } from "./AuthContext"

const user = userEvent.setup()

const mockNotice = vi.fn()
vi.mock("@yamada-ui/react", async () => {
  const actual = await vi.importActual<object>("@yamada-ui/react")
  return { ...(actual as object), useNotice: () => mockNotice }
})

function renderWithProviders(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>,
  )
}

function Consumer() {
  const auth = useAuth()
  return (
    <div>
      <div data-testid="token">{auth.token ?? ""}</div>
      <button
        onClick={() =>
          auth.login.mutate({ email: "e@example.com", password: "p", rememberMe: false })
        }
        type="button"
      >
        login
      </button>
      <button onClick={() => auth.emailVerificationCode.mutate("e@example.com")} type="button">
        code
      </button>
      <button
        onClick={() =>
          auth.register.mutate({
            email: "e@example.com",
            password: "p",
            emailVerificationCode: "123456",
          })
        }
        type="button"
      >
        register
      </button>
    </div>
  )
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    mockNotice.mockReset()
  })

  it("throws when useAuth is used outside provider", () => {
    expect(() => renderHook(() => useAuth())).toThrowError(
      "useAuth must be used within an AuthProvider",
    )
  })

  it("clears token on unauthorized response and returns user null", async () => {
    localStorage.setItem(AUTH_COOKIE_NAME, JSON.stringify("token-123"))
    vi.spyOn(AuthService, "getUserInfo").mockRejectedValue(
      new ApiClientError({
        message: "Unauthorized",
        method: "GET",
        url: "/api/me",
        status: StatusCodes.UNAUTHORIZED,
        statusText: "Unauthorized",
      }),
    )

    renderWithProviders(<Consumer />)

    await waitFor(() => {
      expect(localStorage.getItem(AUTH_COOKIE_NAME)).toBeNull()
    })
  })

  it("sets token on successful login", async () => {
    vi.spyOn(AuthService, "login").mockResolvedValue({ data: "new-token" } as never)

    renderWithProviders(<Consumer />)

    await user.click(screen.getByText("login"))

    await waitFor(() => {
      expect(localStorage.getItem(AUTH_COOKIE_NAME)).toEqual(JSON.stringify("new-token"))
    })
  })

  it("shows notice on login error", async () => {
    vi.spyOn(AuthService, "login").mockRejectedValue(new Error("bad credentials"))

    renderWithProviders(<Consumer />)

    await user.click(screen.getByText("login"))

    await waitFor(() => {
      expect(mockNotice).toHaveBeenCalled()
    })
  })

  it("shows notice on email verification code error", async () => {
    vi.spyOn(AuthService, "sendEmailVerificationCode").mockRejectedValue(new Error("fail"))

    renderWithProviders(<Consumer />)

    await user.click(screen.getByText("code"))

    await waitFor(() => {
      expect(mockNotice).toHaveBeenCalled()
    })
  })

  it("shows notice on register error", async () => {
    vi.spyOn(AuthService, "register").mockRejectedValue(new Error("fail"))

    renderWithProviders(<Consumer />)

    await user.click(screen.getByText("register"))

    await waitFor(() => {
      expect(mockNotice).toHaveBeenCalled()
    })
  })
})
