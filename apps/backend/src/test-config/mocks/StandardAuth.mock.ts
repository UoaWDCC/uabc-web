import { NextRequest } from "next/server"

export const createMockNextRequest = (url: string, email: string, password: string) => {
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}
