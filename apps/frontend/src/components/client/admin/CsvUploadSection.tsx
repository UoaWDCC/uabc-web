"use client"

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  useToast,
  VStack,
} from "@yamada-ui/react"
import { memo, useState } from "react"
import CsvUploadService, { type CsvUploadResponse } from "@/services/admin/user/CsvUploadService"

export const CsvUploadSection = memo(() => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<CsvUploadResponse | null>(null)
  const toast = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        status: "error",
      })
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const result = await CsvUploadService.uploadCsv(file)
      setUploadResult(result)

      toast({
        title: "Upload completed",
        description: result.message,
        status: result.success ? "success" : "warning",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `first_name,last_name,email,role,phone_number,play_level,gender,dietary_requirements,student_id,student_upi,university,remaining_sessions
John,Doe,john.doe@example.com,member,021123456,beginner,male,None,123456789,JD123,UoA,10
Jane,Smith,jane.smith@example.com,casual,021654321,intermediate,female,Vegetarian,987654321,JS456,AUT,5`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "members_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <VStack gap="md" w="full">
      <Card>
        <CardHeader>
          <Heading size="md">Upload Members CSV</Heading>
        </CardHeader>
        <CardBody>
          <VStack gap="md">
            <Text>
              Upload a CSV file to create multiple members at once. The CSV should have a header row
              with column names.
            </Text>

            <Box>
              <Text fontWeight="bold" mb="sm">
                Supported columns:
              </Text>
              <Text color="gray.600" fontSize="sm">
                first_name, last_name, email, role, phone_number, play_level, gender,
                dietary_requirements, student_id, student_upi, university, remaining_sessions
              </Text>
            </Box>

            <VStack gap="sm">
              <Button onClick={downloadTemplate} size="sm" variant="outline">
                Download Template
              </Button>

              <Button
                as="label"
                disabled={isUploading}
                htmlFor="csv-upload"
                isLoading={isUploading}
                loadingText="Uploading..."
              >
                Select CSV File
              </Button>

              <input
                accept=".csv"
                id="csv-upload"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                type="file"
              />
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {uploadResult && (
        <Card>
          <CardHeader>
            <Heading size="md">Upload Results</Heading>
          </CardHeader>
          <CardBody>
            <VStack gap="md">
              <Alert status={uploadResult.success ? "success" : "warning"}>
                <AlertIcon />
                <AlertDescription>{uploadResult.message}</AlertDescription>
              </Alert>

              <Box>
                <Text fontWeight="bold" mb="sm">
                  Summary:
                </Text>
                <Text>Created: {uploadResult.created}</Text>
                <Text>Failed: {uploadResult.failed}</Text>
              </Box>

              {uploadResult.errors.length > 0 && (
                <Box>
                  <Text fontWeight="bold" mb="sm">
                    Errors:
                  </Text>
                  <VStack align="start" gap="xs">
                    {uploadResult.errors.map((error, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Text color="red.500" fontSize="sm" key={index}>
                        Row {error.row}: {error.error}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
})

CsvUploadSection.displayName = "CsvUploadSection"
