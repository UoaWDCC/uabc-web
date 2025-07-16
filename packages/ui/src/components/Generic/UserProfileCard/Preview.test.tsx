import { InputType } from "@repo/ui/components/Primitive"
import { render, screen } from "@repo/ui/test-utils"
import type { SelectItem } from "@yamada-ui/react"
import { Preview } from "./Preview"
import { UserProfileProvider } from "./UserProfileContext"

describe("<Preview />", () => {
  const fields = [
    {
      key: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      inputType: InputType.Text,
      required: true,
    },
    {
      key: "gender",
      type: "select",
      label: "Gender",
      placeholder: "Select your gender",
      items: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ] as SelectItem[],
    },
    {
      key: "interests",
      type: "multiselect",
      label: "Interests",
      placeholder: "Select your interests",
      items: [
        { value: "sports", label: "Sports" },
        { value: "music", label: "Music" },
      ] as SelectItem[],
    },
  ] as const

  it("renders text value", () => {
    render(
      <UserProfileProvider defaultValues={{ fullName: "John Doe" }} fields={fields}>
        <Preview field={fields[0]} />
      </UserProfileProvider>,
    )
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
  })

  it("renders select value", () => {
    render(
      <UserProfileProvider defaultValues={{ gender: "male" }} fields={fields}>
        <Preview field={fields[1]} />
      </UserProfileProvider>,
    )
    expect(screen.getByDisplayValue("Male")).toBeInTheDocument()
  })

  it("renders multiselect value", () => {
    render(
      <UserProfileProvider defaultValues={{ interests: ["sports", "music"] }} fields={fields}>
        <Preview field={fields[2]} />
      </UserProfileProvider>,
    )
    expect(screen.getByDisplayValue("Sports, Music")).toBeInTheDocument()
  })
})
