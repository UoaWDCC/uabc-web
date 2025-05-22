import fs from "node:fs/promises"
import path from "node:path"
import { glob } from "glob"

async function collectCoverageFiles() {
  try {
    // Define the patterns to search
    const patterns = ["../../apps/**", "../../packages/**"]

    // Define the destination directory (you can change this as needed)
    const destinationDir = path.join(process.cwd(), "coverage/raw")
    const summaryDir = path.join(destinationDir, "summary")
    const finalDir = path.join(destinationDir, "final")

    // Create the destination directories if they don't exist
    await fs.mkdir(summaryDir, { recursive: true })
    await fs.mkdir(finalDir, { recursive: true })

    // Arrays to collect all directories and directories with coverage.json
    const allDirectories = []
    const directoriesWithCoverage = []

    // Helper to extract project name from path
    function getProjectName(dirPath: string): string {
      // Normalize path separators
      const normalized = dirPath.replace(/\\/g, "/")
      // Try to match apps/frontend/coverage, apps/backend/coverage, packages/ui/coverage, etc.
      const match = normalized.match(/(?:apps|packages)\/([^/]+)\/coverage/)
      if (match?.[1]) return match[1]
      // Fallback: use last directory name before 'coverage'
      const parts = normalized.split("/")
      const coverageIdx = parts.lastIndexOf("coverage")
      if (coverageIdx > 0) return parts[coverageIdx - 1]
      // Fallback: use last directory name
      return parts[parts.length - 1]
    }

    // Process each pattern
    for (const pattern of patterns) {
      // Find all paths matching the pattern
      const matches = await glob(pattern)

      // Filter to only include directories
      for (const match of matches) {
        const stats = await fs.stat(match)

        if (stats.isDirectory()) {
          allDirectories.push(match)
          const coverageFinalPath = path.join(match, "coverage-final.json")
          const coverageSummaryPath = path.join(match, "coverage-summary.json")

          // Check if coverage-final.json and coverage-summary.json exist in this directory
          try {
            await fs.access(coverageFinalPath)
            await fs.access(coverageSummaryPath)

            console.log(match)

            // Files exist, add to list of directories with coverage
            directoriesWithCoverage.push(match)

            // Use project name as prefix
            const projectName = getProjectName(match)
            const destinationFinalFile = path.join(finalDir, `${projectName}.json`)
            const destinationSummaryFile = path.join(summaryDir, `${projectName}.json`)

            console.log("Copying", coverageFinalPath, destinationFinalFile)

            await fs.copyFile(coverageFinalPath, destinationFinalFile)
            await fs.copyFile(coverageSummaryPath, destinationSummaryFile)
          } catch (_err) {
            // Files don't exist in this directory, skip
          }
        }
      }
    }

    // Create clean patterns for display (without any "../" prefixes)
    const replaceDotPatterns = (str: string) => str.replace(/\.\.\//g, "")

    console.log(directoriesWithCoverage)

    if (directoriesWithCoverage.length > 0) {
      console.log(
        `Found coverage.json in: ${directoriesWithCoverage.map(replaceDotPatterns).join(", ")}`,
      )
    }

    console.log(`Coverage collected into: ${path.join(process.cwd())}`)
  } catch (error) {
    console.error("Error collecting coverage files:", error)
  }
}

// Run the function
collectCoverageFiles()
