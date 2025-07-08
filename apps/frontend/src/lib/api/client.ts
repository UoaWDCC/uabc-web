import type { z } from "zod"

export class ApiClient {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!this.baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined")
    }
  }

  public async get<T>(path: string, schema: z.Schema<T>, tags: string[] = []): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      next: {
        tags,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
    }

    const data = await response.json()
    return schema.parse(data)
  }
}

export const api = new ApiClient()
