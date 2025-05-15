import type { CreateUserData } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"

export const userMock: User = {
  id: "60a4fa6ff8ba5b0a929c1143",
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@example.com",
  role: "casual",
  remainingSessions: 5,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const userCreateMock: CreateUserData = {
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@example.com",
  role: "casual",
  remainingSessions: 5,
  image: null,
}
