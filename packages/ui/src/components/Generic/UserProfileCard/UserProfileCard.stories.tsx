import { Gender, PlayLevel } from "@repo/shared"
import { InputType } from "@repo/ui/components/Primitive"
import type { Meta, StoryFn } from "@storybook/react"
import { UserProfileCard } from "./UserProfileCard"

const meta: Meta<typeof UserProfileCard> = {
  component: UserProfileCard,
  title: "Generic Components / UserProfileCard",
}

export default meta

const exampleFields = [
  {
    key: "fullName",
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
    inputType: InputType.Text,
    required: true,
  },
  {
    key: "email",
    type: "text",
    label: "Email Address",
    placeholder: "Enter your email",
    inputType: InputType.Email,
    required: true,
    disabled: true,
  },
  {
    key: "phoneNumber",
    type: "text",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputType: InputType.Tel,
  },
] as const

const genderOptions = Object.values(Gender).map((value) => ({
  value,
  label: value,
}))

const playLevelOptions = Object.values(PlayLevel).map((value) => ({
  value,
  label: value,
}))

export const Default: StoryFn = () => (
  <UserProfileCard
    defaultValues={{
      fullName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "0211234567",
    }}
    fields={exampleFields}
    onSave={async (data) => {
      console.log("Form submitted:", data)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Form submitted! Check console for details.")
    }}
    title="User Profile"
  />
)

export const AdditionalFields: StoryFn = () => {
  const minimalFields = [
    {
      key: "gender",
      type: "select",
      label: "Gender",
      placeholder: "Select your gender",
      required: true,
      items: genderOptions,
    },
    {
      key: "playLevel",
      type: "select",
      label: "Play Level",
      placeholder: "Select your play level",
      required: true,
      items: playLevelOptions,
    },
    {
      key: "dietaryRequirements",
      type: "text",
      label: "Dietary Requirements",
      placeholder: "Enter your dietary requirements",
    },
  ] as const

  return (
    <UserProfileCard
      defaultValues={{
        gender: Gender.MALE,
        playLevel: PlayLevel.BEGINNER,
      }}
      fields={minimalFields}
      onSave={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Minimal form submitted:", data)
        alert("Form submitted! Check console for details.")
      }}
      title="Additional Fields"
    />
  )
}

export const WithGroupedSelectOptions: StoryFn = () => {
  const groupedFields = [
    {
      key: "name",
      type: "text",
      label: "Name",
      placeholder: "Enter your name",
      required: true,
    },
    {
      key: "interests",
      type: "multiselect",
      label: "Interests",
      placeholder: "Select your interests",
      items: [
        { value: "singles", label: "Singles" },
        { value: "doubles", label: "Doubles" },
      ],
    },
    {
      key: "location",
      type: "select",
      label: "Location",
      placeholder: "Select your location",
      items: [
        {
          label: "Auckland",
          items: [
            { value: "auckland-city", label: "Auckland City" },
            { value: "north-shore", label: "North Shore" },
            { value: "west-auckland", label: "West Auckland" },
          ],
        },
        {
          label: "Wellington",
          items: [
            { value: "wellington-city", label: "Wellington City" },
            // cspell:disable-next-line
            { value: "lower-hutt", label: "Lower Hutt" },
            // cspell:disable-next-line
            { value: "upper-hutt", label: "Upper Hutt" },
          ],
        },
      ],
    },
  ] as const

  return (
    <UserProfileCard
      fields={groupedFields}
      onSave={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Grouped form submitted:", data)
        alert("Form submitted! Check console for details.")
      }}
      title="Location Profile"
    />
  )
}
