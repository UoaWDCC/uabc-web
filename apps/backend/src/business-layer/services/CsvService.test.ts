import { Gender, MembershipType, PlayLevel, University } from "@repo/shared"
import CsvService from "./CsvService"

describe("CsvService", () => {
  const csvService = new CsvService()

  describe("parseCsvUsers", () => {
    it("should parse a valid CSV row successfully", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),Yes,12345678,UoA,5`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.errors).toHaveLength(0)
      const user = result.success[0]
      expect(user.firstName).toBe("John")
      expect(user.lastName).toBe("Doe")
      expect(user.email).toBe("test@example.com")
      expect(user.gender).toBe(Gender.female)
      expect(user.playLevel).toBe(PlayLevel.beginner)
      expect(user.university).toBe(University.uoa)
      expect(user.studentId).toBe("12345678")
      expect(user.remainingSessions).toBe(5)
      expect(user.role).toBe(MembershipType.member)
    })

    it("should parse multiple rows successfully", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft
    21/07/2025 10:04:35,test@example.com,John,Doe,Female,Advanced (just starting out to a few months of playing),Yes,12345678,UoA,5
    21/07/2025 10:24:35,test2@example.com,Jane,Don,Male,Intermediate (1-2 years of playing),No,,AUT,0`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.success).toHaveLength(2)
      expect(result.errors).toHaveLength(0)
      expect(result.success[0]).toStrictEqual({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        gender: Gender.female,
        playLevel: PlayLevel.advanced,
        university: University.uoa,
        studentId: "12345678",
        remainingSessions: 5,
        role: MembershipType.member,
      })
      expect(result.success[1]).toStrictEqual({
        firstName: "Jane",
        lastName: "Don",
        email: "test2@example.com",
        gender: Gender.male,
        playLevel: PlayLevel.intermediate,
        university: University.aut,
        studentId: null,
        remainingSessions: 0,
        role: MembershipType.casual,
      })
    })

    it("should handle invalid field", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft
    21/07/2025 10:04:35,straightZhao.com,John,Doe,Female,Beginner (just starting out to a few months of playing),Yes,12345678,UoA,5`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.success).toHaveLength(0)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].errors).toContain("Invalid email format")
      expect(result.errors[0].row).toBe(2)
    })

    it("should use default values for invalid fields", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft
    21/07/2025 10:04:35,straight@zhao.com,John,Doe,Female,sz (just starting out to a few months of playing),Yes,12345678,UoA,5
    21/07/2025 10:04:35,straight@zhao.com,John,,Female,Beginner (just starting out to a few months of playing),Yes,12345678,UoA,5
    21/07/2025 10:04:35,straight@zhao.com,John,Doe,,Beginner (just starting out to a few months of playing),Yes,12345678,UoA,5`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.errors).toHaveLength(0)
      expect(result.success[0].playLevel).toBeNull()
      expect(result.success[1].lastName).toBeNull()
      expect(result.success[2].gender).toBeNull()
    })

    it("should handle missing fields and return errors appropriately", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft
        21/07/2025 10:04:35,straight@zhao.com,,Doe,Female,sz (just starting out to a few months of playing),Yes,12345678,UoA,5
        21/07/2025 10:04:35,,John,Doe,Female,sz (just starting out to a few months of playing),Yes,12345678,UoA,5`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.success).toHaveLength(0)
      expect(result.errors).toHaveLength(2)
      expect(result.errors[0].errors).toContain("First name is required")
      expect(result.errors[1].errors).toContain("Email is required")
    })

    it("should handle all switch cases and edge cases", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft
        21/07/2025 10:04:35,straight@zhao.com,John,Doe,Prefer not to say,sz (just starting out to a few months of playing),Yes,12345678,UoA,5
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),No,,Massey,5
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),No,,Working,5
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),No,,N/A,5`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.success[0].gender).toBe(Gender.preferNotToAnswer)
      // University edge cases
      expect(result.success[1].university).toBe(University.massey)
      expect(result.success[2].university).toBe(University.working)
      expect(result.success[3].university).toBe(University.notAStudent)
    })

    it("should handle unused extra fields", () => {
      const csvContent = `timestamp,email,firstName,lastName,gender,skillLevel,uoaStudentOrStaff,uoaIdNumber,university,sessionsLeft,extraField1,extraField2
        21/07/2025 10:04:35,straight@zhao.com,John,Doe,Prefer not to say,sz (just starting out to a few months of playing),Yes,12345678,UoA,5,extraValue1,extraValue2
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),No,,Massey,5,extraValue3,extraValue4
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),No,,Working,5,extraValue5,extraValue6
        21/07/2025 10:04:35,test@example.com,John,Doe,Female,Beginner (just starting out to a few months of playing),No,,N/A,5,extraValue7,extraValue8`

      const result = csvService.parseCsvUsers(csvContent)

      expect(result.success[0].gender).toBe(Gender.preferNotToAnswer)
      // University edge cases
      expect(result.success[1].university).toBe(University.massey)
      expect(result.success[2].university).toBe(University.working)
      expect(result.success[3].university).toBe(University.notAStudent)
    })
  })
})
