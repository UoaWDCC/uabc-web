/**
 * Download content as a file with the specified filename and MIME type.
 *
 * @param content The content to download
 * @param filename The filename for the downloaded file
 * @param mimeType The MIME type for the file
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  try {
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
  } finally {
    if (document.body.contains(link)) {
      document.body.removeChild(link)
    }
    URL.revokeObjectURL(url)
  }
}

/**
 * Download CSV content as a file with the specified filename.
 *
 * @param csvContent The CSV content to download
 * @param filename The filename for the downloaded CSV file
 */
export const downloadCsvFile = (csvContent: string, filename: string): void => {
  downloadFile(csvContent, filename, "text/csv;charset=utf-8;")
}

/**
 * We can add more specialized download functions here in the future if needed
 * such as downloadJsonFile, downloadTextFile, etc.
 */
