import type { z } from "zod"

/**
 * ApiClient is a simple HTTP client for making API requests with runtime validation using zod schemas.
 */
class ApiClient {
  /**
   * The base URL for all API requests.
   *
   * @private
   */
  private readonly baseUrl: string

  /**
   * Creates an instance of ApiClient.
   *
   * @param baseUrl The base URL for the API. If not provided, uses NEXT_PUBLIC_API_URL from environment variables.
   * @throws If no base URL is provided or found in environment variables.
   */
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL
    if (!this.baseUrl) {
      throw new Error(
        "API URL is not defined. Please provide it in the constructor or set NEXT_PUBLIC_API_URL environment variable.",
      )
    }
  }

  /**
   * Properly joins the base URL with a path, ensuring no double slashes or missing slashes.
   *
   * @param path The path to join with the base URL.
   * @returns The properly formatted URL.
   * @private
   */
  private joinUrl(path: string): string {
    const normalizedBaseUrl = this.baseUrl.replace(/\/+$/, "")
    const normalizedPath = path.replace(/^\/+/, "")
    return `${normalizedBaseUrl}/${normalizedPath}`
  }

  /**
   * Performs a GET request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param schema The zod schema to validate the response data.
   * @param tags Optional tags for caching or revalidation (used by Next.js fetch).
   * @param revalidate Optional revalidation time in seconds or false to disable revalidation.
   * @returns The validated response data or error.
   */
  public async get<T>(
    path: string,
    schema: z.Schema<T>,
    tags: string[] = [],
    revalidate?: number | false,
  ): Promise<{ data?: T; error?: Error; isError: boolean; status: number | null }> {
    try {
      const response = await fetch(this.joinUrl(path), {
        next: {
          tags,
          ...(revalidate !== undefined ? { revalidate } : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
      }

      const data = await response.json()
      return { data: schema.parse(data), isError: false, status: response.status }
    } catch (error) {
      return { error: error as Error, isError: true, status: null }
    }
  }

  /**
   * Performs a POST request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param body The request body to send.
   * @param schema The zod schema to validate the response data.
   * @param tags Optional tags for caching or revalidation (used by Next.js fetch).
   * @param revalidate Optional revalidation time in seconds or false to disable revalidation.
   * @returns The validated response data or error.
   */
  public async post<T>(
    path: string,
    body: unknown,
    schema: z.Schema<T>,
    tags: string[] = [],
    revalidate?: number | false,
  ): Promise<{ data?: T; error?: Error; isError: boolean; status: number | null }> {
    try {
      const response = await fetch(this.joinUrl(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        next: {
          tags,
          ...(revalidate !== undefined ? { revalidate } : {}),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
      }
      const data = await response.json()
      return { data: schema.parse(data), isError: false, status: response.status }
    } catch (error) {
      return { error: error as Error, isError: true, status: null }
    }
  }

  /**
   * Performs a PUT request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param body The request body to send.
   * @param schema The zod schema to validate the response data.
   * @param tags Optional tags for caching or revalidation (used by Next.js fetch).
   * @param revalidate Optional revalidation time in seconds or false to disable revalidation.
   * @returns The validated response data or error.
   */
  public async put<T>(
    path: string,
    body: unknown,
    schema: z.Schema<T>,
    tags: string[] = [],
    revalidate?: number | false,
  ): Promise<{ data?: T; error?: Error; isError: boolean }> {
    try {
      const response = await fetch(this.joinUrl(path), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        next: {
          tags,
          ...(revalidate !== undefined ? { revalidate } : {}),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
      }
      const data = await response.json()
      return { data: schema.parse(data), isError: false }
    } catch (error) {
      return { error: error as Error, isError: true }
    }
  }

  /**
   * Performs a PATCH request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param body The request body to send.
   * @param schema The zod schema to validate the response data.
   * @param tags Optional tags for caching or revalidation (used by Next.js fetch).
   * @param revalidate Optional revalidation time in seconds or false to disable revalidation.
   * @returns The validated response data or error.
   */
  public async patch<T>(
    path: string,
    body: unknown,
    schema: z.Schema<T>,
    tags: string[] = [],
    revalidate?: number | false,
  ): Promise<{ data?: T; error?: Error; isError: boolean; status: number | null }> {
    try {
      const response = await fetch(this.joinUrl(path), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        next: {
          tags,
          ...(revalidate !== undefined ? { revalidate } : {}),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
      }
      const data = await response.json()
      return { data: schema.parse(data), isError: false, status: response.status }
    } catch (error) {
      return { error: error as Error, isError: true, status: null }
    }
  }

  /**
   * Performs a DELETE request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param schema Optional zod schema to validate the response data.
   * @param tags Optional tags for caching or revalidation (used by Next.js fetch).
   * @param revalidate Optional revalidation time in seconds or false to disable revalidation.
   * @returns The validated response data or error.
   */
  public async delete<T>(
    path: string,
    schema?: z.Schema<T>,
    tags?: string[],
    revalidate?: number | false,
  ): Promise<{ data?: T; error?: Error; isError: boolean; status: number | null }> {
    try {
      const response = await fetch(this.joinUrl(path), {
        method: "DELETE",
        next: {
          tags: tags ?? [],
          ...(revalidate !== undefined ? { revalidate } : {}),
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`)
      }
      const data = await response.json()
      return { data: schema ? schema.parse(data) : data, isError: false, status: response.status }
    } catch (error) {
      return { error: error as Error, isError: true, status: null }
    }
  }
}

/**
 * Factory function to create a new ApiClient instance.
 * In most cases, you should use the exported {@link apiClient} instance directly,
 * unless you need to target a different API base URL (e.g., for testing or multi-environment support).
 *
 * @param baseUrl Optional base URL for the API. Defaults to NEXT_PUBLIC_API_URL.
 * @returns A new ApiClient instance.
 */
export const createApiClient = (baseUrl?: string): ApiClient => {
  return new ApiClient(baseUrl ?? process.env.NEXT_PUBLIC_API_URL)
}

/**
 * Default ApiClient instance using the environment base URL.
 * In most cases, prefer using this exported instance.
 */
export const apiClient = createApiClient()
