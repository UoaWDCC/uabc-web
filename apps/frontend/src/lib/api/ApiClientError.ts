export class ApiClientError extends Error {
  public readonly method: string
  public readonly url: string
  public readonly status: number | null
  public readonly statusText: string | null
  public readonly errorBody: unknown
  public readonly originalError: unknown

  constructor({
    message,
    method,
    url,
    status = null,
    statusText = null,
    errorBody = undefined,
    originalError = undefined,
  }: {
    message: string
    method: string
    url: string
    status?: number | null
    statusText?: string | null
    errorBody?: unknown
    originalError?: unknown
  }) {
    super(message)
    this.name = "ApiClientError"
    this.method = method
    this.url = url
    this.status = status
    this.statusText = statusText
    this.errorBody = errorBody
    this.originalError = originalError
    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack
    }
  }
}
