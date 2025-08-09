import { Gender, MembershipType, PlayLevel, Weekday } from "../types"

export const MembershipTypeLabel: Record<MembershipType, string> = {
  [MembershipType.member]: "Member",
  [MembershipType.casual]: "Casual",
  [MembershipType.admin]: "Admin",
}

export const PlayLevelLabel: Record<PlayLevel, string> = {
  [PlayLevel.beginner]: "Beginner",
  [PlayLevel.intermediate]: "Intermediate",
  [PlayLevel.advanced]: "Advanced",
}

export const GenderLabel: Record<Gender, string> = {
  [Gender.male]: "Male",
  [Gender.female]: "Female",
  [Gender.nonBinary]: "Non-binary",
  [Gender.other]: "Other",
  [Gender.preferNotToAnswer]: "Prefer not to answer",
}

export const WeekdayLabel: Record<Weekday, string> = {
  [Weekday.sunday]: "Sunday",
  [Weekday.monday]: "Monday",
  [Weekday.tuesday]: "Tuesday",
  [Weekday.wednesday]: "Wednesday",
  [Weekday.thursday]: "Thursday",
  [Weekday.friday]: "Friday",
  [Weekday.saturday]: "Saturday",
}
