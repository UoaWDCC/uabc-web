/**
 * API client utility for frontend application
 */

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
}

/**
 * Custom fetch wrapper that automatically prepends the API URL
 */
export const apiFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const apiUrl = getApiUrl()
  const url = endpoint.startsWith("/") ? `${apiUrl}${endpoint}` : `${apiUrl}/${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response
}

/**
 * API client for common operations
 */
export const api = {
  /**
   * GET request that returns JSON
   */
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await apiFetch(endpoint, options)
    return response.json()
  },

  /**
   * POST request that returns JSON
   *
   */
  // biome-ignore lint/suspicious/noExplicitAny: The `data` parameter is intentionally typed as `any` to allow flexible payloads for different POST requests.
  post: async <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await apiFetch(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    return response.json()
  },

  /**
   * PUT request that returns JSON
   *
   */
  // biome-ignore lint/suspicious/noExplicitAny: The `data` parameter is intentionally typed as `any` to allow flexible payloads for different PUT requests.
  put: async <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await apiFetch(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    return response.json()
  },

  /**
   * PATCH request that returns JSON
   *
   */
  // biome-ignore lint/suspicious/noExplicitAny: The `data` parameter is intentionally typed as `any` to allow flexible payloads for different PATCH requests.
  patch: async <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await apiFetch(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
    return response.json()
  },

  /**
   * DELETE request
   */
  delete: async (endpoint: string, options?: RequestInit): Promise<void> => {
    await apiFetch(endpoint, {
      method: "DELETE",
      ...options,
    })
  },
}
