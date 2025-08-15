export interface CsvUploadResponse {
  success: boolean
  message: string
  created: number
  failed: number
  errors: Array<{
    row: number
    error: string
  }>
}

const CsvUploadService = {
  /**
   * Uploads a CSV file containing user data to create multiple users.
   *
   * @param file The CSV file to upload
   * @returns A promise that resolves to the upload response
   */
  uploadCsv: async (file: File): Promise<CsvUploadResponse> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/admin/users/upload-csv", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        message: "Upload failed",
        created: 0,
        failed: 0,
        errors: [],
      }))
      throw new Error(errorData.message || "Upload failed")
    }

    return await response.json()
  },
} as const

export default CsvUploadService
