#!/usr/bin/env bun

import { rm } from "node:fs/promises"
import { glob } from "glob"

type CleanOptions = {
  /** Whether to output verbose logging */
  verbose?: boolean
}

const CLEAN_PATTERNS = [
  "*/dist",
  "*/.turbo",
  "*.log",
  "*/coverage",
  "**/node_modules",
  "*/.next",
  "*/storybook-static",
  "*/.wrangler",
]

/**
 * Clean files and directories based on glob patterns
 */
async function cleanFiles(patterns: string[], options: CleanOptions = {}) {
  const { verbose = false } = options

  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, {
        dot: true,
        absolute: true,
      })

      if (files.length === 0) {
        if (verbose) {
          console.log(`No files found for pattern: ${pattern}`)
        }
        continue
      }

      for (const file of files) {
        try {
          await rm(file, { recursive: true, force: true })
          if (verbose) {
            console.log(`Removed: ${file}`)
          }
        } catch (error) {
          if (verbose) {
            console.warn(`Failed to remove ${file}:`, error)
          }
        }
      }

      if (verbose) {
        console.log(`Cleaned pattern: ${pattern} (${files.length} items)`)
      }
    } catch (error) {
      if (verbose) {
        console.warn(`Error processing pattern ${pattern}:`, error)
      }
    }
  }
}

/**
 * Main function to handle command line arguments and execute the clean operation
 */
async function main() {
  const args = process.argv.slice(2)
  const options: CleanOptions = {
    verbose: args.includes("--verbose") || args.includes("-v"),
  }

  const patterns = CLEAN_PATTERNS

  console.log("Starting clean...")

  await cleanFiles(patterns, options)

  console.log("Clean completed successfully!")
}

main().catch((error) => {
  console.error("Clean failed:", error)
  process.exit(1)
})
