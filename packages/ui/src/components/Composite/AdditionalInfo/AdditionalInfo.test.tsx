import { Gender, PlayLevel } from "@repo/shared"
import { casualUserMock } from "@repo/shared/mocks"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { AdditionalInfo, defaultFields, defaultValues } from "./AdditionalInfo"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const userMock = {
  ...casualUserMock,
  gender: casualUserMock.gender ?? Gender.male,
  playLevel: casualUserMock.playLevel ?? PlayLevel.beginner,
}

const createWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe("<AdditionalInfo />", () => {
  it("renders the card with title and fields", () => {
    render(
      <AdditionalInfo
        defaultValues={defaultValues}
        fields={defaultFields}
        title="Additional Info"
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.getByText("Additional Info")).toBeInTheDocument()
    expect(screen.getByText("Gender")).toBeInTheDocument()
    expect(screen.getByText("Play Level")).toBeInTheDocument()
    expect(screen.getByText("Dietary Requirements")).toBeInTheDocument()
  })

  it("calls onSave when saving changes", async () => {
    const consoleLog = vi.fn()
    vi.spyOn(console, "log").mockImplementation(consoleLog)
    const { user } = render(
      <AdditionalInfo
        defaultValues={defaultValues}
        fields={defaultFields}
        onSave={async (data) => {
          consoleLog("onSave", data)
        }}
        title="Additional Info"
      />,
      {
        wrapper: createWrapper,
      },
    )
    await user.click(screen.getByRole("button", { name: /edit/i }))
    const genderInput = screen.getByRole("combobox", { name: /gender/i })
    await user.click(genderInput)
    await user.click(screen.getByRole("option", { name: userMock.gender }))
    const playLevelInput = screen.getByRole("combobox", { name: /play level/i })
    await user.click(playLevelInput)
    await user.click(screen.getByRole("option", { name: userMock.playLevel }))
    await user.click(screen.getByRole("button", { name: /save changes/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue(userMock.gender)).toBeInTheDocument()
      expect(screen.getByDisplayValue(userMock.playLevel)).toBeInTheDocument()
    })
    expect(consoleLog).toHaveBeenCalledWith("onSave", {
      gender: userMock.gender,
      playLevel: userMock.playLevel,
      dietary: userMock.dietaryRequirements,
    })
  })
})
