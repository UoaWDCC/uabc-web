import { render, screen, waitFor } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { defaultFields, defaultValues, ProfileDetails } from "./ProfileDetails"

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
        fields={defaultFields}
        title="Profile Details"
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.getByText("Profile Details")).toBeInTheDocument()
    expect(screen.getByText("First Name")).toBeInTheDocument()
    expect(screen.getByText("Last Name")).toBeInTheDocument()
    expect(screen.getByText("Email Address")).toBeInTheDocument()
    expect(screen.getByText("Phone Number")).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultValues.firstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultValues.lastName ?? "")).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultValues.email)).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultValues.phoneNumber ?? "")).toBeInTheDocument()
  })

  it("calls onSave when saving changes", async () => {
    const consoleLog = vi.fn()
    vi.spyOn(console, "log").mockImplementation(consoleLog)
    const { user } = render(
      <ProfileDetails
        defaultValues={defaultValues}
        fields={defaultFields}
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
    const input = screen.getByPlaceholderText("Enter your first name")
    await user.clear(input)
    await user.type(input, "Jane")
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument()
      expect(screen.getByDisplayValue(defaultValues.lastName ?? "")).toBeInTheDocument()
    })
    expect(consoleLog).toHaveBeenCalledWith("onSave", {
      firstName: "Jane",
      lastName: defaultValues.lastName ?? "",
      phoneNumber: defaultValues.phoneNumber ?? "",
    })
  })
})
