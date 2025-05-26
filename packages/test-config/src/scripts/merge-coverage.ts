import fs from "node:fs"
import path from "node:path"

const PROJECT_ROOT = path.resolve(process.cwd(), "..", "..")
const COVERAGE_DIRS = ["apps/frontend/coverage", "apps/backend/coverage", "packages/ui/coverage"]
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, "coverage")
const FINAL_FILE = "coverage-final.json"
const SUMMARY_FILE = "coverage-summary.json"

function readJsonIfExists<T>(filePath: string): T | null {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`Found: ${filePath}`)
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T
    }
    console.warn(`Not found: ${filePath}`)
  } catch (e) {
    console.warn(`Failed to read ${filePath}:`, e)
  }
  return null
}

function mergeCoverageFinal(files: CoverageFinal[]): CoverageFinal {
  return Object.assign({}, ...files)
}

function mergeCoverageSummary(files: CoverageSummary[]): CoverageSummary {
  // Aggregate totals
  const totalKeys: CoverageKey[] = ["lines", "statements", "functions", "branches", "branchesTrue"]
  const overallTotal: Record<CoverageKey, CoverageMetric> = {
    lines: { total: 0, covered: 0, skipped: 0 },
    statements: { total: 0, covered: 0, skipped: 0 },
    functions: { total: 0, covered: 0, skipped: 0 },
    branches: { total: 0, covered: 0, skipped: 0 },
    branchesTrue: { total: 0, covered: 0, skipped: 0 },
  }

  // Sum up totals from each file
  for (const file of files) {
    if (!file.total) continue
    for (const key of totalKeys) {
      const t = file.total[key]
      if (!t) continue
      overallTotal[key].total += t.total || 0
      overallTotal[key].covered += t.covered || 0
      overallTotal[key].skipped += t.skipped || 0
    }
  }

  // Calculate percentages
  for (const key of totalKeys) {
    const t = overallTotal[key]
    t.pct = t.total === 0 ? 100 : Math.round((t.covered / t.total) * 10000) / 100
  }

  // Merge all per-file objects (excluding 'total')
  const merged = Object.assign({}, ...files.map(({ total, ...rest }) => rest))

  // Insert the aggregated total
  return { total: overallTotal, ...merged }
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }

  // Merge coverage-final.json
  const finals = COVERAGE_DIRS.map((dir) =>
    readJsonIfExists<CoverageFinal>(path.resolve(PROJECT_ROOT, dir, FINAL_FILE)),
  ).filter(Boolean) as CoverageFinal[]
  const mergedFinal = mergeCoverageFinal(finals)
  fs.writeFileSync(path.join(OUTPUT_DIR, FINAL_FILE), JSON.stringify(mergedFinal, null, 2))

  // Merge coverage-summary.json
  const summaries = COVERAGE_DIRS.map((dir) =>
    readJsonIfExists<CoverageSummary>(path.resolve(PROJECT_ROOT, dir, SUMMARY_FILE)),
  ).filter(Boolean) as CoverageSummary[]
  const mergedSummary = mergeCoverageSummary(summaries)
  fs.writeFileSync(path.join(OUTPUT_DIR, SUMMARY_FILE), JSON.stringify(mergedSummary, null, 2))

  console.log("Merged coverage written to", OUTPUT_DIR)
}

main()

type CoverageMetric = {
  total: number
  covered: number
  skipped: number
  pct?: number
}

type CoverageSummary = {
  total: Record<CoverageKey, CoverageMetric>
} & Record<string, Record<CoverageKey, CoverageMetric>>

type CoverageKey = "lines" | "statements" | "functions" | "branches" | "branchesTrue"

type CoverageFinal = Record<string, FileCoverageData>

type FileCoverageData = {
  path: string
  statementMap: Record<string, unknown>
  fnMap: Record<string, unknown>
  branchMap: Record<string, unknown>
  s: Record<string, number>
  f: Record<string, number>
  b: Record<string, number[]>
  inputSourceMap?: object
  hash?: string
}
