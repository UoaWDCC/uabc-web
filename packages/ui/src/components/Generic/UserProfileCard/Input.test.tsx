import { InputType } from "@repo/ui/components/Primitive"
import { render, screen } from "@repo/ui/test-utils"
import type { SelectItem } from "@yamada-ui/react"
import { useEffect } from "react"
import { Input } from "./Input"
import { UserProfileProvider, useUserProfile } from "./UserProfileContext"

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

function EditingWrapper({ children }: { children: React.ReactNode }) {
  const { startEditing } = useUserProfile<typeof fields>()
  useEffect(() => {
    startEditing()
  }, [startEditing])
  return <>{children}</>
}

describe("<Input />", () => {
  it("renders text input", () => {
    render(
      <UserProfileProvider fields={fields}>
        <EditingWrapper>
          <Input field={fields[0]} />
        </EditingWrapper>
      </UserProfileProvider>,
    )
    expect(screen.getByPlaceholderText("Enter your full name")).toBeInTheDocument()
  })

  it("renders select input", async () => {
    const { user } = render(
      <UserProfileProvider fields={fields}>
        <EditingWrapper>
          <Input field={fields[1]} />
        </EditingWrapper>
      </UserProfileProvider>,
    )
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    await user.click(screen.getByRole("combobox"))
    expect(screen.getByText("Male")).toBeInTheDocument()
    expect(screen.getByText("Female")).toBeInTheDocument()
  })

  it("renders multiselect input", async () => {
    const { user } = render(
      <UserProfileProvider fields={fields}>
        <EditingWrapper>
          <Input field={fields[2]} />
        </EditingWrapper>
      </UserProfileProvider>,
    )
    await user.click(screen.getByRole("combobox"))
    expect(screen.getByText("Sports")).toBeInTheDocument()
    expect(screen.getByText("Music")).toBeInTheDocument()
  })

  it("renders nothing when not editing", () => {
    render(
      <UserProfileProvider fields={fields}>
        <Input field={fields[0]} />
      </UserProfileProvider>,
    )
    expect(screen.queryByPlaceholderText("Enter your full name")).toBeNull()
  })
})
