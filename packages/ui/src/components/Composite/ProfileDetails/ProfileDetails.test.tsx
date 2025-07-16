import { InputType } from "@repo/ui/components/Primitive"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { ProfileDetails } from "./ProfileDetails"

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
  },
  {
    key: "phoneNumber",
    type: "text",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputType: InputType.Tel,
  },
] as const

const defaultValues = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "0211234567",
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const createWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe("<ProfileDetails />", () => {
  it("renders the card with title and fields", () => {
    render(
      <ProfileDetails
        defaultValues={defaultValues}
        fields={exampleFields}
        title="Profile Details"
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.getByText("Profile Details")).toBeInTheDocument()
    expect(screen.getByText("Full Name")).toBeInTheDocument()
    expect(screen.getByText("Email Address")).toBeInTheDocument()
    expect(screen.getByText("Phone Number")).toBeInTheDocument()
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
    expect(screen.getByDisplayValue("john.doe@example.com")).toBeInTheDocument()
    expect(screen.getByDisplayValue("0211234567")).toBeInTheDocument()
  })

  it("calls onSave when saving changes", async () => {
    const consoleLog = vi.fn()
    vi.spyOn(console, "log").mockImplementation(consoleLog)
    const { user } = render(
      <ProfileDetails
        defaultValues={defaultValues}
        fields={exampleFields}
        onSave={async (data) => {
          consoleLog("onSave", data)
        }}
        title="Profile Details"
      />,
      {
        wrapper: createWrapper,
      },
    )
    await user.click(screen.getByRole("button", { name: /edit/i }))
    const input = screen.getByPlaceholderText("Enter your full name")
    await user.clear(input)
    await user.type(input, "Jane Smith")
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument()
    })
    expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument()
    expect(consoleLog).toHaveBeenCalledWith("onSave", {
      fullName: "Jane Smith",
      email: "john.doe@example.com",
      phoneNumber: "0211234567",
    })
  })
})
