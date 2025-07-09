import { StatusCodes } from "http-status-codes"
import AuthDataService from "@/data-layer/services/AuthDataService"
import UserDataService from "@/data-layer/services/UserDataService"
import { createMockNextRequest } from "@/test-config/backend-utils"
import { POST } from "./route"

describe("tests /api/auth/register", () => {
  const userDataService = new UserDataService()
  const authDataService = new AuthDataService()

  it("should register a new user", async () => {
    const registerBody = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "Password123!",
    }
    const res = await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.CREATED)
    expect(json.message).toBe("User registered successfully")

    const user = await userDataService.getUserById(json.data.id)
    expect(user.firstName).toEqual(registerBody.firstName)
    expect(user.lastName).toEqual(registerBody.lastName)
    expect(user.email).toEqual(registerBody.email)
    expect(user.role).toEqual("casual")

    const auth = await authDataService.getAuthByEmail(registerBody.email)
    expect(auth.password).not.toEqual(registerBody.password)
  })

  it("should return a 409 conflict if user already exists", async () => {
    const registerBody = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "Password123!",
    }
    await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))

    const res = await POST(createMockNextRequest("/api/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.CONFLICT)
    expect(json.error).toBe("A user with that email already exists")
  })

  it("should return a 400 bad request if the payload is invalid", async () => {
    const registerBody = {
      firstName: "30CharactersLongNameThatDoesNoMeetTheSpecificationsOfTheSchema",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "Password123!",
    }
    const res = await POST(createMockNextRequest("/api/auth/register", "POST", registerBody))
    const json = await res.json()

    expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    expect(json.error).toBe("Invalid request body")
  })
})
