import { InputType } from "@repo/ui/components/Primitive"
import { render, screen } from "@repo/ui/test-utils"
import { vi } from "vitest"
import { UserProfileCard } from "./UserProfileCard"

describe("<UserProfileCard />", () => {
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
      key: "email",
      type: "text",
      label: "Email Address",
      placeholder: "Enter your email",
      inputType: InputType.Email,
      required: true,
    },
  ] as const

  it("renders the card with title and fields", () => {
    render(
      <UserProfileCard
        defaultValues={{ fullName: "John Doe", email: "john@example.com" }}
        fields={fields}
        title="User Profile"
      />,
    )
    expect(screen.getByText("User Profile")).toBeInTheDocument()
    expect(screen.getByText("Full Name")).toBeInTheDocument()
    expect(screen.getByText("Email Address")).toBeInTheDocument()
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument()
  })

  it("enters edit mode and cancels", async () => {
    const { user } = render(
      <UserProfileCard
        defaultValues={{ fullName: "John Doe", email: "john@example.com" }}
        fields={fields}
        title="User Profile"
      />,
    )
    await user.click(screen.getByRole("button", { name: /edit/i }))
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /cancel/i }))
    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument()
  })

  it("calls onSave when saving changes", async () => {
    const onSave = vi.fn()
    const { user } = render(
      <UserProfileCard
        defaultValues={{ fullName: "John Doe", email: "john@example.com" }}
        fields={fields}
        onSave={onSave}
        title="User Profile"
      />,
    )
    await user.click(screen.getByRole("button", { name: /edit/i }))
    const input = screen.getByPlaceholderText("Enter your full name")
    await user.clear(input)
    await user.type(input, "Jane Smith")
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: "Jane Smith", email: "john@example.com" }),
    )
  })
})
