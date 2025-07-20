import type { z } from "zod"

type ApiResponse<T> =
  | { success: true; data: T; status: number }
  | { success: false; error: Error; status: number | null }

type RequestOptions = {
  headers?: Record<string, string>
  tags?: string[]
  revalidate?: number | false
}

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
   * Creates fetch options with consistent configuration.
   *
   * @param method The HTTP method.
   * @param body Optional request body.
   * @param options Request options including headers, tags, and revalidation.
   * @returns Fetch options object.
   * @private
   */
  private createFetchOptions(
    method: string,
    body?: unknown,
    options: RequestOptions = {},
  ): RequestInit & { next?: { tags: string[]; revalidate?: number | false } } {
    const { headers = {}, tags = [], revalidate } = options

    const fetchOptions: RequestInit & { next?: { tags: string[]; revalidate?: number | false } } = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      next: {
        tags,
      },
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    if (revalidate !== undefined) {
      fetchOptions.next = {
        tags: fetchOptions.next?.tags || [],
        revalidate,
      }
    }

    return fetchOptions
  }

  /**
   * Handles the response and returns a consistent ApiResponse.
   *
   * @param response The fetch response.
   * @param schema The zod schema to validate the response data.
   * @returns A consistent ApiResponse.
   * @private
   */
  private async handleResponse<T>(
    response: Response,
    schema: z.Schema<T>,
  ): Promise<ApiResponse<T>> {
    if (!response.ok) {
      return {
        success: false,
        error: new Error(`HTTP ${response.status}: ${response.statusText}`),
        status: response.status,
      }
    }

    try {
      const data = await response.json()
      const parsedData = schema.parse(data)
      return {
        success: true,
        data: parsedData,
        status: response.status,
      }
    } catch {
      return {
        success: false,
        error: new Error("Invalid response format"),
        status: response.status,
      }
    }
  }

  /**
   * Performs a GET request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param schema The zod schema to validate the response data.
   * @param options Optional request options.
   * @returns The validated response data or error.
   */
  public async get<T>(
    path: string,
    schema: z.Schema<T>,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(
        this.joinUrl(path),
        this.createFetchOptions("GET", undefined, options),
      )
      return await this.handleResponse(response, schema)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Network error"),
        status: null,
      }
    }
  }

  /**
   * Performs a POST request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param body The request body to send.
   * @param schema The zod schema to validate the response data.
   * @param options Optional request options.
   * @returns The validated response data or error.
   */
  public async post<T>(
    path: string,
    body: unknown,
    schema: z.Schema<T>,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(
        this.joinUrl(path),
        this.createFetchOptions("POST", body, options),
      )
      return await this.handleResponse(response, schema)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Network error"),
        status: null,
      }
    }
  }

  /**
   * Performs a PUT request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param body The request body to send.
   * @param schema The zod schema to validate the response data.
   * @param options Optional request options.
   * @returns The validated response data or error.
   */
  public async put<T>(
    path: string,
    body: unknown,
    schema: z.Schema<T>,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(
        this.joinUrl(path),
        this.createFetchOptions("PUT", body, options),
      )
      return await this.handleResponse(response, schema)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Network error"),
        status: null,
      }
    }
  }

  /**
   * Performs a PATCH request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param body The request body to send.
   * @param schema The zod schema to validate the response data.
   * @param options Optional request options.
   * @returns The validated response data or error.
   */
  public async patch<T>(
    path: string,
    body: unknown,
    schema: z.Schema<T>,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(
        this.joinUrl(path),
        this.createFetchOptions("PATCH", body, options),
      )
      return await this.handleResponse(response, schema)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Network error"),
        status: null,
      }
    }
  }

  /**
   * Performs a DELETE request to the specified path and validates the response using the provided zod schema.
   *
   * @param path The API endpoint path (relative to baseUrl).
   * @param schema Optional zod schema to validate the response data.
   * @param options Optional request options.
   * @returns The validated response data or error.
   */
  public async delete<T>(
    path: string,
    schema?: z.Schema<T>,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(
        this.joinUrl(path),
        this.createFetchOptions("DELETE", undefined, options),
      )

      if (!response.ok) {
        return {
          success: false,
          error: new Error(`HTTP ${response.status}: ${response.statusText}`),
          status: response.status,
        }
      }

      // For DELETE requests, we might not always have a response body
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return {
          success: true,
          data: undefined as T,
          status: response.status,
        }
      }

      if (schema) {
        return await this.handleResponse(response, schema)
      }

      // If no schema provided, try to parse as JSON or return undefined
      try {
        const data = await response.json()
        return {
          success: true,
          data: data as T,
          status: response.status,
        }
      } catch {
        return {
          success: true,
          data: undefined as T,
          status: response.status,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Network error"),
        status: null,
      }
    }
  }

  /**
   * Helper method to throw an error if the response is not successful.
   * Useful for services that want to handle errors by throwing.
   *
   * @param response The API response.
   * @param errorMessage Optional custom error message.
   * @returns The data if successful.
   * @throws Error if the response is not successful.
   */
  public static throwIfError<T>(response: ApiResponse<T>, errorMessage?: string): T {
    if (!response.success) {
      throw new Error(errorMessage || response.error.message)
    }
    return response.data
  }

  /**
   * Helper method to return null if the response is not successful.
   * Useful for optional operations where null is an acceptable fallback.
   *
   * @param response The API response.
   * @returns The data if successful, null otherwise.
   */
  public static returnNullIfError<T>(response: ApiResponse<T>): T | null {
    return response.success ? response.data : null
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

// Export types for use in services
export type { ApiResponse, RequestOptions }

// Export the ApiClient class for testing
export { ApiClient }
