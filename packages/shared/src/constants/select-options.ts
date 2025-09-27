import { Gender, MembershipType, PlayLevel, University } from "../types/enums"

/**
 * Options for the University Select component, using enum values from {@link University}.
 */
export const UniversityOptions = Object.values(University).map((university) => ({
  value: university,
  label: university,
}))

/**
 * Options for the Gender Select component, using enum values from {@link Gender}.
 */
export const GenderOptions = Object.values(Gender).map((gender) => ({
  value: gender,
  label: gender,
}))

/**
 * Options for the Skill Level Select component, using enum values from {@link PlayLevel}.
 */
export const PlayLevelOptions = Object.values(PlayLevel).map((playLevel) => ({
  value: playLevel,
  label: playLevel,
}))

/**
 * Options for the Role Select component, using enum values from {@link MembershipType}
 */
export const RoleOptions = Object.values(MembershipType).map((membershipType) => ({
  value: membershipType,
  label: membershipType,
}))
