import fs from "node:fs"
import path from "node:path"
import { isMainThread } from "node:worker_threads"

const PROJECT_ROOT = path.resolve(process.cwd(), "..", "..")
const COVERAGE_DIRS = ["apps/frontend/coverage", "apps/backend/coverage", "packages/ui/coverage"]
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, "coverage")
const FINAL_FILE = "coverage-final.json"
const SUMMARY_FILE = "coverage-summary.json"

const readJsonIfExists = async <T>(filePath: string): Promise<T | null> => {
  try {
    if (fs.existsSync(filePath)) {
      const data = await fs.promises.readFile(filePath, "utf-8")
      return JSON.parse(data) as T
    }
  } catch (e) {
    console.warn(`Failed to read ${filePath}:`, e)
  }
  return null
}

const mergeCoverageFinal = (files: CoverageFinal[]): CoverageFinal => Object.assign({}, ...files)

const mergeCoverageSummary = (files: CoverageSummary[]): CoverageSummary => {
  const totalKeys: CoverageKey[] = ["lines", "statements", "functions", "branches", "branchesTrue"]
  const overallTotal: Record<CoverageKey, CoverageMetric> = {
    lines: { total: 0, covered: 0, skipped: 0 },
    statements: { total: 0, covered: 0, skipped: 0 },
    functions: { total: 0, covered: 0, skipped: 0 },
    branches: { total: 0, covered: 0, skipped: 0 },
    branchesTrue: { total: 0, covered: 0, skipped: 0 },
  }

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

  for (const key of totalKeys) {
    const t = overallTotal[key]
    t.pct = t.total === 0 ? 100 : Math.round((t.covered / t.total) * 10000) / 100
  }

  const merged = Object.assign({}, ...files.map(({ total, ...rest }) => rest))
  return { total: overallTotal, ...merged }
}

const processCoverage = async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    await fs.promises.mkdir(OUTPUT_DIR)
  }

  const finals = await Promise.all(
    COVERAGE_DIRS.map((dir) =>
      readJsonIfExists<CoverageFinal>(path.resolve(PROJECT_ROOT, dir, FINAL_FILE)),
    ),
  )
  const mergedFinal = mergeCoverageFinal(finals.filter(Boolean) as CoverageFinal[])
  await fs.promises.writeFile(
    path.join(OUTPUT_DIR, FINAL_FILE),
    JSON.stringify(mergedFinal, null, 2),
  )

  const summaries = await Promise.all(
    COVERAGE_DIRS.map((dir) =>
      readJsonIfExists<CoverageSummary>(path.resolve(PROJECT_ROOT, dir, SUMMARY_FILE)),
    ),
  )
  const mergedSummary = mergeCoverageSummary(summaries.filter(Boolean) as CoverageSummary[])
  await fs.promises.writeFile(
    path.join(OUTPUT_DIR, SUMMARY_FILE),
    JSON.stringify(mergedSummary, null, 2),
  )

  console.log("Merged coverage written to", OUTPUT_DIR)
}

if (isMainThread) {
  processCoverage().catch(console.error)
}

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
