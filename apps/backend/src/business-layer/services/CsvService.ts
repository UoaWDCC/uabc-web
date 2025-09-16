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

/**
 * The CsvService class provides functionality for parsing CSV user data and mapping it to CreateUserData objects.
 */
export default class CsvService {
  /**
   * Parses a CSV string into an array of CreateUserData objects.

   * @param csvContent The CSV content to parse.
   * @returns An ImportResult object containing the parsed data.
   * @example
   * timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft,extraField
   * 21/07/2025 10:04:35,straight@zhao.com,Straight,Zhao,Female,Beginner (just starting out to a few months of playing),Yes,1234569,UoA,69,extraValue1
   */
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

  /**
   * Maps a CSV row to a CreateUserData object.
   *
   * @param row The CSV row to map.
   * @param errors An array to collect errors.
   * @returns The mapped CreateUserData object.
   */
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

  /**
   * Maps a gender string to a Gender enum value.
   *
   * @param genderStr The gender string to map.
   * @returns The mapped Gender enum value, or null if the string is invalid.
   */
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

  /**
   * Maps a skill level string to a PlayLevel enum value.
   *
   * @param skillStr The skill level string to map.
   * @returns The mapped PlayLevel enum value, or null if the string is invalid.
   */
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

  /**
   * Maps a university string to a University enum value.
   *
   * @param universityStr The university string to map.
   * @param uoaStudentOrStaffStr The UOA student or staff string to map.
   * @param _errors The array of errors to add to.
   * @returns The mapped University enum value, or null if the string is invalid.
   */
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
   * @param email The email string to check.
   * @returns True if the email is valid, false otherwise.
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
