import {
  type CreateUserData,
  Gender,
  type ImportResult,
  MembershipType,
  PlayLevel,
  University,
} from "@repo/shared"
import { parse } from "csv-parse/sync"

interface CsvUserRow {
  timestamp: string
  email: string
  firstName: string
  lastName: string
  gender: string
  skillLevel: string
  uoaStudentOrStaff: string
  uoaIdNumber?: string
  university: string
  sessionsLeft: string
}

export default class CsvService {
  public parseCsvUsers(csvContent: string): ImportResult {
    const result: ImportResult = { success: [], errors: [] }

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvUserRow[]

    records.forEach((record, index) => {
      const rowNumber = index + 2
      const errors: string[] = []

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
    })

    return result
  }

  public mapCsvRowToUserData(row: CsvUserRow, errors: string[]): CreateUserData {
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

    const gender = this.mapGender(row.gender)
    const playLevel = this.mapSkillLevel(row.skillLevel)
    const university = this.mapUniversity(row.university, row.uoaStudentOrStaff, errors)
    const remainingSessions = Number(row.sessionsLeft)

    return {
      firstName: row.firstName?.trim(),
      lastName: row.lastName?.trim() || null,
      email: email,
      role: remainingSessions > 0 ? MembershipType.member : MembershipType.casual,
      playLevel,
      gender,
      studentId: row.uoaIdNumber?.trim() || null,
      university,
      remainingSessions,
    }
  }

  private mapGender(genderStr: string): Gender | null {
    const gender = genderStr.trim().toLowerCase()
    switch (gender) {
      case "male":
        return Gender.male
      case "female":
        return Gender.female
      case "prefer not to say":
        return Gender.preferNotToAnswer
      default:
        return null
    }
  }

  private mapSkillLevel(skillStr: string): PlayLevel | null {
    const skill = skillStr.trim().toLowerCase()
    if (skill.includes("beginner")) {
      return PlayLevel.beginner
    }
    if (skill.includes("intermediate")) {
      return PlayLevel.intermediate
    }
    if (skill.includes("advanced")) {
      return PlayLevel.advanced
    }
    return null
  }

  private mapUniversity(
    universityStr: string,
    uoaStudentOrStaffStr: string,
    _errors: string[],
  ): University | null {
    const uni = universityStr.trim().toLowerCase()
    const uoaStudentOrStaff = uoaStudentOrStaffStr.trim().toLowerCase()

    let uniOutput: University | null = null

    if (
      uoaStudentOrStaff === "yes" ||
      uni.includes("university of auckland") ||
      uni.includes("uoa") ||
      uni.includes("u of a")
    ) {
      uniOutput = University.uoa
    }

    if (uni.includes("aut") || uni.includes("auckland university of technology")) {
      uniOutput = University.aut
    }

    if (uni.includes("massey")) {
      uniOutput = University.massey
    }

    if (uni.includes("working") || uni.includes("employed") || uni.includes("work")) {
      uniOutput = University.working
    }

    if (
      uni === "" ||
      uni.includes("not a student") ||
      uni.includes("none") ||
      uni.includes("n/a")
    ) {
      uniOutput = University.notAStudent
    }

    return uniOutput
  }

  /**
   * Method to check if an email is valid
   *
   * @param email
   * @returns
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
