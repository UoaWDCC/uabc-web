import { InputType } from "@repo/ui/components/Primitive"
import { render, screen } from "@repo/ui/test-utils"
import { FieldGroup } from "./FieldGroup"
import { UserProfileProvider } from "./UserProfileContext"

describe("<FieldGroup />", () => {
  const fields = [
    {
      key: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      inputType: InputType.Text,
      required: true,
    },
  ] as const

  it("renders label and input", () => {
    render(
      <UserProfileProvider fields={fields}>
        <FieldGroup field={fields[0]} />
      </UserProfileProvider>,
    )
    expect(screen.getByText("Full Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter your full name")).toBeInTheDocument()
  })
})
