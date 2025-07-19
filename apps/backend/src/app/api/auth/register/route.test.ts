import { MembershipType, type RegisterDetails } from "@repo/shared"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { POST } from "./route"

describe("tests /api/auth/register", () => {
  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()

  const registerBody = {
    email: "johndoe@example.com",
    password: "Password123!",
    emailVerificationCode: "123456",
  } satisfies RegisterDetails

  it("should register a new user", async () => {
    await userDataService.createUser({
      email: registerBody.email,
      emailVerificationCode: registerBody.emailVerificationCode,
      role: MembershipType.casual,
    })
    const res = await POST(
      createMockNextRequest("/api/auth/register", "POST", registerBody satisfies RegisterDetails),
    )
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.CREATED)
    expect(json.message).toBe("User registered successfully")

    const user = await userDataService.getUserById(json.data.id)
    expect(user).toStrictEqual(json.data)

    const auth = await authDataService.getAuthByEmail(registerBody.email)
    expect(auth.password).not.toEqual(registerBody.password)
  })

  it("should return a 400 if a user submits an incorrect verification code", async () => {
    await userDataService.createUser({
      email: registerBody.email,
      emailVerificationCode: "333555",
      role: MembershipType.casual,
    })
    const res = await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe("Invalid email verification code")
  })

  it("should return a 403 if the user hasn't created a verification code request", async () => {
    const res = await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.FORBIDDEN)
    expect(json.error).toBe("Email not verified")
  })

  it("should return a 409 conflict if user already exists", async () => {
    await userDataService.createUser({
      email: registerBody.email,
      emailVerificationCode: registerBody.emailVerificationCode,
      role: MembershipType.casual,
    })
    await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))

    const res = await POST(createMockNextRequest("/api/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.CONFLICT)
    expect(json.error).toBe("A user with that email already exists")
  })

  it("should return a 400 bad request if the payload is invalid", async () => {
    const res = await POST(
      createMockNextRequest("/api/auth/register", "POST", {
        ...registerBody,
        password: undefined,
      }),
    )
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe("Invalid request body")
  })

  it("should return 500 if createUser throws unexpected error", async () => {
    const error = new Error("Simulated internal error")

    vi.spyOn(UserDataService.prototype, "getUserByEmail").mockRejectedValueOnce(error)

    const res = await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(json.error).toBe(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  })
})
