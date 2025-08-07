export enum MembershipType {
  member = "member",
  casual = "casual",
  admin = "admin",
}

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

export enum Gender {
  male = "male",
  female = "female",
  nonBinary = "non-binary",
  other = "other",
  preferNotToAnswer = "prefer-not-to-answer",
}

export enum University {
  uoa = "UoA",
  aut = "AUT",
  massey = "Massey University",
  other = "Other",
  working = "Working",
  notAStudent = "Not a student",
}
export enum SessionType {
  ongoing = "Ongoing",
  oneOff = "One off",
}

export enum AdminPage {
  VIEW_MEMBERS = 0,
  VIEW_SESSIONS = 1,
  VIEW_SEMESTERS = 2,
}
