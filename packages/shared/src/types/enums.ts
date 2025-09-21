import { z } from "zod"

export enum MembershipType {
  member = "member",
  casual = "casual",
  admin = "admin",
}

export const MembershipTypeZodEnum = z.enum(["member", "casual", "admin"])

export enum Weekday {
  sunday = "sunday",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
}

// TODO: Decide if we should change PlayLevel enum values to title case
export enum PlayLevel {
  beginner = "beginner",
  intermediate = "intermediate",
  advanced = "advanced",
}

export const PlayLevelZodEnum = z.enum(["beginner", "intermediate", "advanced"], {
  errorMap: () => ({
    message: "Please select a play level",
  }),
})

export enum Gender {
  male = "male",
  female = "female",
  nonBinary = "non-binary",
  other = "other",
  preferNotToAnswer = "prefer-not-to-answer",
}

export const GenderZodEnum = z.enum(
  ["male", "female", "non-binary", "other", "prefer-not-to-answer"],
  {
    errorMap: () => ({
      message: "Please select a gender",
    }),
  },
)

export enum University {
  uoa = "UoA",
  aut = "AUT",
  massey = "Massey University",
  other = "Other",
  working = "Working",
  notAStudent = "Not a student",
}

export const UniversityZodEnum = z.enum(
  ["UoA", "AUT", "Massey University", "Other", "Working", "Not a student"],
  {
    errorMap: () => ({
      message: "Please select a University",
    }),
  },
)

export enum SessionType {
  ongoing = "Ongoing",
  oneOff = "One off",
}

export enum GameSessionStatus {
  ONGOING = "Ongoing",
  UPCOMING = "Upcoming",
  PAST = "Past",
}
