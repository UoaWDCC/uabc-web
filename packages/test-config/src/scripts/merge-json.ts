import fs from "node:fs/promises"
import path from "node:path"
import { glob } from "glob"

import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const root = path.join(__dirname, "..", "..", "..", "..")

// Type for Istanbul coverage-final.json
export type IstanbulCoverageFinal = Record<
  string,
  {
    path: string
    statementMap: Record<
      string,
      { start: { line: number; column: number }; end: { line: number; column: number | null } }
    >
    fnMap: Record<
      string,
      {
        name: string
        decl: {
          start: { line: number; column: number }
          end: { line: number; column: number | null }
        }
        loc: {
          start: { line: number; column: number }
          end: { line: number; column: number | null }
        }
      }
    >
    // biome-ignore lint/suspicious/noExplicitAny: json can have any keys
    branchMap: Record<string, any>
    s: Record<string, number>
    f: Record<string, number>
    b: Record<string, number[]>
    // biome-ignore lint/suspicious/noExplicitAny: json can have any keys
    [key: string]: any // Allow additional keys for dynamic access
  }
>

/**
 * Merges multiple Istanbul final coverage objects into a single object.
 * @param {IstanbulCoverageFinal[]} files - Array of coverage objects to merge.
 * @returns {IstanbulCoverageFinal} Merged coverage object.
 */
function mergeFinalCoverage(files: IstanbulCoverageFinal[]): IstanbulCoverageFinal {
  const merged: IstanbulCoverageFinal = {}
  for (const file of files) {
    for (const [filename, data] of Object.entries(file)) {
      if (!merged[filename]) {
        merged[filename] = JSON.parse(JSON.stringify(data))
      } else {
        // Merge counters (s, f)
        for (const key of ["s", "f"]) {
          for (const idx in data[key]) {
            merged[filename][key][idx] = (merged[filename][key][idx] || 0) + (data[key][idx] || 0)
          }
        }
        // Merge branch counters (b)
        if (data.b) {
          for (const idx in data.b) {
            if (!merged[filename].b[idx]) {
              merged[filename].b[idx] = data.b[idx]
            } else {
              for (let i = 0; i < data.b[idx].length; i++) {
                merged[filename].b[idx][i] =
                  (merged[filename].b[idx][i] || 0) + (data.b[idx][i] || 0)
              }
            }
          }
        }
      }
    }
  }
  return merged
}

/**
 * Merges multiple Istanbul summary coverage objects into a single object.
 * @param {Record<string, any>[]} files - Array of summary coverage objects to merge.
 * @returns {Record<string, any>} Merged summary coverage object.
 */
function mergeSummaryCoverage(files: Record<string, any>[]): Record<string, any> {
  const merged: Record<string, any> = {}
  const keys = ["lines", "statements", "functions", "branches"]
  const subkeys = ["total", "covered", "skipped"]
  for (const file of files) {
    for (const [filename, data] of Object.entries(file)) {
      if (!merged[filename]) {
        merged[filename] = JSON.parse(JSON.stringify(data))
        // Ensure all keys and subkeys exist
        for (const key of keys) {
          if (!merged[filename][key]) {
            merged[filename][key] = { total: 0, covered: 0, skipped: 0, pct: 100 }
          } else {
            for (const sub of subkeys) {
              if (typeof merged[filename][key][sub] !== "number") {
                merged[filename][key][sub] = 0
              }
            }
            if (typeof merged[filename][key].pct !== "number") {
              merged[filename][key].pct = 100
            }
          }
        }
      } else {
        // Merge counters for total and per-file
        for (const key of keys) {
          if (!merged[filename][key]) {
            merged[filename][key] = { total: 0, covered: 0, skipped: 0, pct: 100 }
          }
          if (data[key]) {
            for (const sub of subkeys) {
              merged[filename][key][sub] = (merged[filename][key][sub] || 0) + (data[key][sub] || 0)
            }
          }
        }
      }
    }
  }
  // Recalculate pct fields
  for (const data of Object.values(merged)) {
    for (const key of keys) {
      if (data[key]) {
        data[key].pct = data[key].total > 0 ? (data[key].covered / data[key].total) * 100 : 100
        if (typeof data[key].pct === "number") {
          data[key].pct = Math.round(data[key].pct * 100) / 100
        }
      }
    }
  }
  return merged
}

/**
 * Merges coverage files from multiple directories into a single coverage file.
 * @returns {Promise<void>} A promise that resolves when the merge is complete.
 */
export async function mergeCoverageFiles() {
  const _cwd = process.cwd()
  // Find all coverage-final.json and coverage-summary.json files in apps and packages
  const finalFiles = await glob([
    "../../apps/frontend/coverage/coverage-final.json",
    "../../apps/backend/coverage/coverage-final.json",
    "../../packages/ui/coverage/coverage-final.json",
  ])
  const summaryFiles = await glob([
    "../../apps/frontend/coverage/coverage-summary.json",
    "../../apps/backend/coverage/coverage-summary.json",
    "../../packages/ui/coverage/coverage-summary.json",
  ])

  // Read and merge final coverage
  const finalData: IstanbulCoverageFinal[] = []
  for (const file of finalFiles) {
    try {
      const content = await fs.readFile(file, "utf-8")
      finalData.push(JSON.parse(content))
    } catch (e) {
      console.error(`Failed to read or parse ${file}:`, e)
    }
  }
  const mergedFinal = mergeFinalCoverage(finalData)
  const finalOut = path.resolve(root, "coverage/coverage-final.json")
  await fs.mkdir(path.dirname(finalOut), { recursive: true })
  await fs.writeFile(finalOut, JSON.stringify(mergedFinal, null, 2))
  console.log(`Merged ${finalFiles.length} coverage-final.json files into ${finalOut}`)

  // Read and merge summary coverage
  // biome-ignore lint/suspicious/noExplicitAny: json can have any keys
  const summaryData: Record<string, any>[] = []
  for (const file of summaryFiles) {
    try {
      const content = await fs.readFile(file, "utf-8")
      summaryData.push(JSON.parse(content))
    } catch (e) {
      console.error(`Failed to read or parse ${file}:`, e)
    }
  }
  const mergedSummary = mergeSummaryCoverage(summaryData)
  const summaryOut = path.resolve(root, "coverage/coverage-summary.json")
  await fs.mkdir(path.dirname(summaryOut), { recursive: true })
  await fs.writeFile(summaryOut, JSON.stringify(mergedSummary, null, 2))
  console.log(`Merged ${summaryFiles.length} coverage-summary.json files into ${summaryOut}`)
}

mergeCoverageFiles().catch((e) => {
  console.error(e)
  process.exit(1)
})
