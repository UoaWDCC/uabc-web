"use client"

import type { User } from "@repo/shared/payload-types"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

// Mock data generation
const FIRST_NAMES = [
  "John",
  "Jane",
  "Jim",
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Ivy",
  "Jack",
  "Kara",
  "Liam",
  "Mona",
  "Nate",
  "Olive",
  "Paul",
  "Quinn",
  "Rita",
  "Sam",
  "Tina",
  "Uma",
  "Vince",
  "Wendy",
  "Xander",
  "Yara",
  "Zane",
  "Fay",
  "Gus",
  "Hope",
  "Iris",
  "Jude",
  "Kurt",
  "Lara",
  "Mick",
  "Nina",
  "Omar",
  "Pia",
]

const LAST_NAMES = [
  "Doe",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Garcia",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
]

const UNIVERSITIES: User["university"][] = [
  "UoA",
  "AUT",
  "Massey University",
  "Other",
  "Working",
  "Not a student",
]

const ROLES: User["role"][] = ["member", "casual", "admin"]

const PLAY_LEVELS: User["playLevel"][] = ["beginner", "intermediate", "advanced"]

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)]
}

function getRandomItemOrNull<T>(arr: T[], nullChance = 0.3): T | null {
  if (Math.random() < nullChance) {
    return null
  }
  return getRandomItem(arr)
}

// Generate mock data
const generateMockUsers = (): User[] => {
  return Array.from({ length: 40 }, (_, i) => {
    const firstName = getRandomItem(FIRST_NAMES)
    const lastName = Math.random() > 0.1 ? getRandomItem(LAST_NAMES) : null
    const email = `${firstName.toLowerCase()}.${lastName?.toLowerCase() || "user"}${i + 1}@example.com`
    const role = getRandomItem(ROLES)
    const university = getRandomItemOrNull(UNIVERSITIES)
    const playLevel = getRandomItemOrNull(PLAY_LEVELS)
    const remainingSessions = role === "member" ? getRandomInt(0, 20) : null
    const phoneNumber =
      Math.random() > 0.4
        ? `+64 ${getRandomInt(20, 29)} ${getRandomInt(100, 999)} ${getRandomInt(1000, 9999)}`
        : null

    return {
      id: (i + 1).toString(),
      firstName,
      lastName,
      email,
      role,
      phoneNumber,
      playLevel,
      gender: getRandomItemOrNull([
        "male",
        "female",
        "non-binary",
        "other",
        "prefer-not-to-answer",
      ]),
      dietaryRequirements: Math.random() > 0.8 ? "Vegetarian" : null,
      studentId:
        university && university !== "Working" && university !== "Not a student"
          ? `${getRandomInt(100000000, 999999999)}`
          : null,
      studentUpi:
        university === "UoA"
          ? `${getRandomItem(FIRST_NAMES).toLowerCase().slice(0, 4)}${getRandomInt(100, 999)}`
          : null,
      university,
      remainingSessions,
      image: null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - getRandomInt(0, 365) * 24 * 60 * 60 * 1000).toISOString(),
    }
  })
}

// Add column definitions
export const AVAILABLE_COLUMNS = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "role", label: "Role", required: false },
  { key: "remainingSessions", label: "Remaining Sessions", required: false },
  { key: "university", label: "University", required: false },
  { key: "actions", label: "Actions", required: true },
] as const

export type ColumnKey = (typeof AVAILABLE_COLUMNS)[number]["key"]

export type FilterOptions = {
  searchFields?: (keyof User)[]
  enableRoleFilter?: boolean
  enableUniversityFilter?: boolean
  // biome-ignore lint/suspicious/noExplicitAny: we need to allow any type here
  customFilters?: Record<string, (member: User, value: any) => boolean>
}

type MemberManagementState = {
  // Data
  members: User[]
  filteredMembers: User[]
  paginatedMembers: User[]
  isLoading: boolean

  // Filter state
  filterValue: string
  setFilterValue: (value: string) => void
  roleFilter: User["role"] | "all"
  setRoleFilter: (role: User["role"] | "all") => void
  universityFilter: User["university"] | "all"
  setUniversityFilter: (university: User["university"] | "all") => void
  hasFilter: boolean
  clearFilter: () => void
  clearAllFilters: () => void

  // Column visibility state
  visibleColumns: ColumnKey[]
  setVisibleColumns: (columns: ColumnKey[]) => void
  toggleColumn: (column: ColumnKey) => void

  // Row selection state
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
  toggleRowSelection: (rowId: string) => void
  selectAllRows: () => void
  clearSelection: () => void
  isRowSelected: (rowId: string) => boolean
  isAllSelected: boolean
  isIndeterminate: boolean
  selectedMembers: User[]

  // Search and filtering
  searchInFields: (keyof User)[]
  setSearchFields: (fields: (keyof User)[]) => void
  availableUniversities: (User["university"] | "all")[]

  // Pagination state
  currentPage: number
  setCurrentPage: (page: number) => void
  perPage: number
  setPerPage: (perPage: number) => void
  totalPages: number
  totalItems: number

  // UI State
  isSelectionMode: boolean
  setSelectionMode: (enabled: boolean) => void
}

const MemberManagementContext = createContext<MemberManagementState | null>(null)

type MemberManagementProviderProps = {
  children: ReactNode
  filterOptions?: FilterOptions
}

export const MemberManagementProvider = ({
  children,
  filterOptions = {},
}: MemberManagementProviderProps) => {
  const [searchParams, setSearchParams] = useQueryStates(
    {
      filter: parseAsString.withDefault(""),
      role: parseAsString.withDefault("all"),
      university: parseAsString.withDefault("all"),
      columns: parseAsArrayOf(parseAsString).withDefault([
        "name",
        "email",
        "role",
        "remainingSessions",
        "university",
        "actions",
      ]),
      selectedRows: parseAsArrayOf(parseAsString).withDefault([]),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(20),
    },
    {
      clearOnDefault: true,
    },
  )

  const {
    filter: filterValue,
    role: roleFilter,
    university: universityFilter,
    columns: rawVisibleColumns,
    selectedRows: selectedRowIds,
    page: currentPage,
    perPage,
  } = searchParams

  // UI State
  const [isSelectionMode, setSelectionMode] = useState(false)

  // Search configuration
  const defaultSearchFields: (keyof User)[] = [
    "firstName",
    "lastName",
    "email",
    "role",
    "university",
  ]
  const [searchInFields, setSearchFields] = useState<(keyof User)[]>(
    filterOptions.searchFields || defaultSearchFields,
  )

  // Validate and cast columns to ColumnKey[]
  const visibleColumns = useMemo(() => {
    const validColumns: ColumnKey[] = []
    const availableKeys = AVAILABLE_COLUMNS.map((col) => col.key)

    for (const col of rawVisibleColumns) {
      if (availableKeys.includes(col as ColumnKey)) {
        validColumns.push(col as ColumnKey)
      }
    }

    // Ensure required columns are always included
    const requiredColumns = AVAILABLE_COLUMNS.filter((col) => col.required).map((col) => col.key)
    for (const reqCol of requiredColumns) {
      if (!validColumns.includes(reqCol)) {
        validColumns.push(reqCol)
      }
    }

    return validColumns
  }, [rawVisibleColumns])

  const members = useMemo(() => generateMockUsers(), [])
  const isLoading = false

  // Convert selectedRowIds array to Set for easier manipulation
  const selectedRows = useMemo(() => {
    return new Set(selectedRowIds)
  }, [selectedRowIds])

  // Available filter options
  const availableUniversities = useMemo(() => {
    const universities = new Set<User["university"]>()
    members.forEach((member) => {
      if (member.university) universities.add(member.university)
    })
    return ["all" as const, ...Array.from(universities).sort()]
  }, [members])

  const filteredMembers = useMemo(() => {
    let filtered = members

    // Apply text filter
    if (filterValue) {
      const lowercaseFilter = filterValue.toLowerCase()
      filtered = filtered.filter((member) => {
        return searchInFields.some((field) => {
          const value = member[field]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(lowercaseFilter)
        })
      })
    }

    // Apply role filter
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((member) => member.role === roleFilter)
    }

    // Apply university filter
    if (universityFilter && universityFilter !== "all") {
      filtered = filtered.filter((member) => member.university === universityFilter)
    }

    // Apply custom filters
    if (filterOptions.customFilters) {
      Object.entries(filterOptions.customFilters).forEach(([key, filterFn]) => {
        const filterValue = searchParams[key as keyof typeof searchParams]
        if (filterValue) {
          filtered = filtered.filter((member) => filterFn(member, filterValue))
        }
      })
    }

    return filtered
  }, [
    members,
    filterValue,
    roleFilter,
    universityFilter,
    searchInFields,
    filterOptions.customFilters,
    searchParams,
  ])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredMembers.length / perPage)
  }, [filteredMembers.length, perPage])

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    return filteredMembers.slice(startIndex, endIndex)
  }, [filteredMembers, currentPage, perPage])

  // Selected members
  const selectedMembers = useMemo(() => {
    return members.filter((member) => selectedRows.has(member.id))
  }, [members, selectedRows])

  // Selection state calculations
  const isAllSelected = useMemo(() => {
    if (paginatedMembers.length === 0) return false
    return paginatedMembers.every((member) => selectedRows.has(member.id))
  }, [paginatedMembers, selectedRows])

  const isIndeterminate = useMemo(() => {
    if (paginatedMembers.length === 0) return false
    const selectedCount = paginatedMembers.filter((member) => selectedRows.has(member.id)).length
    return selectedCount > 0 && selectedCount < paginatedMembers.length
  }, [paginatedMembers, selectedRows])

  // Filter functions
  const setFilterValue = useCallback(
    (value: string) => {
      setSearchParams({
        filter: value || null,
        page: 1,
      })
    },
    [setSearchParams],
  )

  const setRoleFilter = useCallback(
    (role: User["role"] | "all") => {
      setSearchParams({
        role: role === "all" ? null : role,
        page: 1,
      })
    },
    [setSearchParams],
  )

  const setUniversityFilter = useCallback(
    (university: User["university"] | "all") => {
      setSearchParams({
        university: university === "all" ? null : university,
        page: 1,
      })
    },
    [setSearchParams],
  )

  const clearFilter = useCallback(() => {
    setSearchParams({
      filter: null,
      page: 1,
    })
  }, [setSearchParams])

  const clearAllFilters = useCallback(() => {
    setSearchParams({
      filter: null,
      role: null,
      university: null,
      page: 1,
    })
  }, [setSearchParams])

  // Column functions
  const setVisibleColumns = useCallback(
    (columns: ColumnKey[]) => {
      setSearchParams({
        columns: columns.length === 6 ? null : (columns as string[]),
      })
    },
    [setSearchParams],
  )

  const toggleColumn = useCallback(
    (column: ColumnKey) => {
      const isRequired = AVAILABLE_COLUMNS.find((col) => col.key === column)?.required
      if (isRequired) return // Don't allow toggling required columns

      const newColumns = visibleColumns.includes(column)
        ? visibleColumns.filter((col) => col !== column)
        : [...visibleColumns, column]

      setVisibleColumns(newColumns)
    },
    [visibleColumns, setVisibleColumns],
  )

  // Row selection functions
  const setSelectedRows = useCallback(
    (rows: Set<string>) => {
      const rowArray = Array.from(rows)
      setSearchParams({
        selectedRows: rowArray.length === 0 ? null : rowArray,
      })
    },
    [setSearchParams],
  )

  const toggleRowSelection = useCallback(
    (rowId: string) => {
      const newSelection = new Set(selectedRows)
      if (newSelection.has(rowId)) {
        newSelection.delete(rowId)
      } else {
        newSelection.add(rowId)
      }
      setSelectedRows(newSelection)
    },
    [selectedRows, setSelectedRows],
  )

  const selectAllRows = useCallback(() => {
    const newSelection = new Set(selectedRows)
    paginatedMembers.forEach((member) => newSelection.add(member.id))
    setSelectedRows(newSelection)
  }, [selectedRows, paginatedMembers, setSelectedRows])

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
  }, [setSelectedRows])

  const isRowSelected = useCallback(
    (rowId: string) => {
      return selectedRows.has(rowId)
    },
    [selectedRows],
  )

  // Pagination functions
  const setCurrentPage = useCallback(
    (page: number) => {
      setSearchParams({ page: page === 1 ? null : page })
    },
    [setSearchParams],
  )

  const setPerPage = useCallback(
    (newPerPage: number) => {
      setSearchParams({
        perPage: newPerPage === 20 ? null : newPerPage,
        page: 1,
      })
    },
    [setSearchParams],
  )

  const hasFilter = !!filterValue || roleFilter !== "all" || universityFilter !== "all"

  const value: MemberManagementState = {
    // Data
    members,
    filteredMembers,
    paginatedMembers,
    isLoading,

    // Filter state
    filterValue,
    setFilterValue,
    roleFilter: roleFilter as User["role"] | "all",
    setRoleFilter,
    universityFilter: universityFilter as User["university"] | "all",
    setUniversityFilter,
    hasFilter,
    clearFilter,
    clearAllFilters,

    // Column visibility state
    visibleColumns,
    setVisibleColumns,
    toggleColumn,

    // Row selection state
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    selectedMembers,

    // Search and filtering
    searchInFields,
    setSearchFields,
    availableUniversities,

    // Pagination state
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPages,
    totalItems: filteredMembers.length,

    // UI State
    isSelectionMode,
    setSelectionMode,
  }

  return (
    <MemberManagementContext.Provider value={value}>{children}</MemberManagementContext.Provider>
  )
}

export const useMemberManagement = () => {
  const context = useContext(MemberManagementContext)
  if (!context) {
    throw new Error("useMemberManagement must be used within a MemberManagementProvider")
  }
  return context
}
