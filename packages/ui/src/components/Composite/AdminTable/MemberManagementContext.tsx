"use client"

import type { User } from "@repo/shared/payload-types"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import type { ReactNode } from "react"
import { createContext, useContext, useMemo } from "react"

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

type MemberManagementState = {
  // Data
  members: User[]
  filteredMembers: User[]
  paginatedMembers: User[]
  isLoading: boolean

  // Filter state
  filterValue: string
  setFilterValue: (value: string) => void
  hasFilter: boolean
  clearFilter: () => void

  // Pagination state
  currentPage: number
  setCurrentPage: (page: number) => void
  perPage: number
  setPerPage: (perPage: number) => void
  totalPages: number
}

const MemberManagementContext = createContext<MemberManagementState | null>(null)

type MemberManagementProviderProps = {
  children: ReactNode
}

export const MemberManagementProvider = ({ children }: MemberManagementProviderProps) => {
  const [searchParams, setSearchParams] = useQueryStates(
    {
      filter: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(20),
    },
    {
      clearOnDefault: true,
    },
  )

  const { filter: filterValue, page: currentPage, perPage } = searchParams

  const members = useMemo(() => generateMockUsers(), [])
  const isLoading = false

  const filteredMembers = useMemo(() => {
    if (!filterValue) {
      return members
    }
    const lowercaseFilter = filterValue.toLowerCase()
    return members.filter((member) => {
      const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ").toLowerCase()
      return (
        fullName.includes(lowercaseFilter) ||
        member.email.toLowerCase().includes(lowercaseFilter) ||
        member.role.toLowerCase().includes(lowercaseFilter) ||
        member.university?.toLowerCase().includes(lowercaseFilter) ||
        member.remainingSessions?.toString().includes(lowercaseFilter)
      )
    })
  }, [members, filterValue])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredMembers.length / perPage)
  }, [filteredMembers.length, perPage])

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    return filteredMembers.slice(startIndex, endIndex)
  }, [filteredMembers, currentPage, perPage])

  const setFilterValue = (value: string) => {
    setSearchParams({
      filter: value || null,
      page: 1,
    })
  }

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: page === 1 ? null : page })
  }

  const setPerPage = (newPerPage: number) => {
    setSearchParams({
      perPage: newPerPage === 20 ? null : newPerPage,
      page: 1,
    })
  }

  const clearFilter = () => {
    setSearchParams({
      filter: null,
      page: 1,
    })
  }

  const hasFilter = !!filterValue

  const value: MemberManagementState = {
    // Data
    members,
    filteredMembers,
    paginatedMembers,
    isLoading,

    // Filter state
    filterValue,
    setFilterValue,
    hasFilter,
    clearFilter,

    // Pagination state
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPages,
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
