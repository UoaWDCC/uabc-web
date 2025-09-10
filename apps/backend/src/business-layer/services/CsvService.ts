import { type CreateUserData, Gender, MembershipType, PlayLevel, University } from "@repo/shared"
import { parse } from "csv-parse/sync"

export interface CsvUserRow {
  timestamp: string
  email: string
  firstName: string
  lastName: string
  gender: string
  skillLevel: string
  uoaId?: string
  university: string
}

export interface ImportResult {
  success: CreateUserData[]
  errors: Array<{ row: number; errors: string[]; data: unknown }>
}

export default class CsvService {
  public parseCsvUsers(csvContent: string): ImportResult {
    const result: ImportResult = {
      success: [],
      errors: [],
    }

    try {
      const records = parse(csvContent, {
        columns: [
          "timestamp",
          "email",
          "firstName",
          "lastName",
          "gender",
          "skillLevel",
          "uoaId",
          "university",
        ],
        skip_empty_lines: true,
        trim: true,
        from_line: 2,
      }) as CsvUserRow[]

      records.forEach((record, index) => {
        const rowNumber = index + 2
        const errors: string[] = []

        try {
          const userData = this.mapCsvRowToUserData(record, errors)

          if (errors.length === 0) {
            result.success.push(userData)
          } else {
            result.errors.push({
              row: rowNumber,
              errors,
              data: record,
            })
          }
        } catch (error) {
          result.errors.push({
            row: rowNumber,
            errors: [error instanceof Error ? error.message : "Unknown parsing error"],
            data: record,
          })
        }
      })
    } catch (error) {
      result.errors.push({
        row: 0,
        errors: [error instanceof Error ? error.message : "Failed to parse CSV"],
        data: null,
      })
    }

    return result
  }

  private mapCsvRowToUserData(row: CsvUserRow, errors: string[]): CreateUserData {
    if (!row.email || !row.email.trim()) {
      errors.push("Email is required")
    }

    if (!row.firstName || !row.firstName.trim()) {
      errors.push("First name is required")
    }

    const email = row.email?.trim().toLowerCase()
    if (email && !this.isValidEmail(email)) {
      errors.push("Invalid email format")
    }

    const gender = this.mapGender(row.gender, errors)
    const playLevel = this.mapSkillLevel(row.skillLevel, errors)
    const university = this.mapUniversity(row.university, errors)

    return {
      firstName: row.firstName?.trim(),
      lastName: row.lastName?.trim() || null,
      email: email,
      role: MembershipType.casual,
      phoneNumber: null,
      playLevel,
      gender,
      dietaryRequirements: null,
      studentId: row.uoaId?.trim() || null,
      studentUpi: null,
      university,
      remainingSessions: 0,
      image: null,
      emailVerification: undefined,
    }
  }

  private mapGender(genderStr: string, errors: string[]): Gender | null {
    if (!genderStr?.trim()) {
      return null
    }

    const gender = genderStr.trim().toLowerCase()
    switch (gender) {
      case "male":
        return Gender.male
      case "female":
        return Gender.female
      default:
        errors.push(`Invalid gender: ${genderStr}. Expected 'male' or 'female'`)
        return null
    }
  }

  private mapSkillLevel(skillStr: string, errors: string[]): PlayLevel | null {
    if (!skillStr?.trim()) {
      return null
    }

    const skill = skillStr.trim().toLowerCase()
    switch (skill) {
      case "beginner":
        return PlayLevel.beginner
      case "intermediate":
        return PlayLevel.intermediate
      case "advanced":
        return PlayLevel.advanced
      default:
        errors.push(
          `Invalid skill level: ${skillStr}. Expected 'Beginner', 'Intermediate', or 'Advanced'`,
        )
        return null
    }
  }

  private mapUniversity(universityStr: string, _errors: string[]): University | null {
    if (!universityStr?.trim()) {
      return null
    }

    const uni = universityStr.trim().toLowerCase()

    if (uni.includes("university of auckland") || uni.includes("uoa") || uni.includes("u of a")) {
      return University.uoa
    }

    if (uni.includes("aut") || uni.includes("auckland university of technology")) {
      return University.aut
    }

    if (uni.includes("massey")) {
      return University.massey
    }

    if (uni.includes("working") || uni.includes("employed") || uni.includes("work")) {
      return University.working
    }

    if (uni.includes("not a student") || uni.includes("none") || uni.includes("n/a")) {
      return University.notAStudent
    }

    return University.other
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
