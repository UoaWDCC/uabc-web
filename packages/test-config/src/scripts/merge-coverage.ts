import fs from "node:fs"
import path from "node:path"

const PROJECT_ROOT = path.resolve(process.cwd(), "..", "..")
const COVERAGE_DIRS = ["apps/frontend/coverage", "apps/backend/coverage", "packages/ui/coverage"]
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, "coverage")
const FINAL_FILE = "coverage-final.json"
const SUMMARY_FILE = "coverage-summary.json"

function readJsonIfExists(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`Found: ${filePath}`)
      return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    }
    console.warn(`Not found: ${filePath}`)
  } catch (e) {
    console.warn(`Failed to read ${filePath}:`, e)
  }
  return null
}

function mergeCoverageFinal(files: any[]): any {
  return Object.assign({}, ...files)
}

function mergeCoverageSummary(files: any[]): any {
  return Object.assign({}, ...files)
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }

  // Merge coverage-final.json
  const finals = COVERAGE_DIRS.map((dir) =>
    readJsonIfExists(path.resolve(PROJECT_ROOT, dir, FINAL_FILE)),
  ).filter(Boolean)
  const mergedFinal = mergeCoverageFinal(finals)
  console.log("Writing merged coverage-final.json")
  fs.writeFileSync(path.join(OUTPUT_DIR, FINAL_FILE), JSON.stringify(mergedFinal, null, 2))

  // Merge coverage-summary.json
  const summaries = COVERAGE_DIRS.map((dir) =>
    readJsonIfExists(path.resolve(PROJECT_ROOT, dir, SUMMARY_FILE)),
  ).filter(Boolean)
  const mergedSummary = mergeCoverageSummary(summaries)
  console.log("Writing merged coverage-summary.json")
  fs.writeFileSync(path.join(OUTPUT_DIR, SUMMARY_FILE), JSON.stringify(mergedSummary, null, 2))

  console.log("Merged coverage written to", OUTPUT_DIR)
}

main()
