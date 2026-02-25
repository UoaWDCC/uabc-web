import { gameSessionScheduleMock } from "@repo/shared/mocks"
import { capitalize, formatTime } from "@repo/shared/utils"
import { render, screen } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { AdminSemestersTable } from "./AdminSemestersTable"

describe("<AdminSemestersTable />", () => {
  it("should be defined and have displayName", () => {
    expect(AdminSemestersTable).toBeDefined()
    expect(AdminSemestersTable.displayName).toBe("AdminSemestersTable")
  })

  it("renders rows and columns", () => {
    render(<AdminSemestersTable data={[gameSessionScheduleMock]} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByText("Session Name")).toBeInTheDocument()
    expect(screen.getByText("Time")).toBeInTheDocument()
    expect(screen.getByText("Location")).toBeInTheDocument()
    expect(screen.getByText("Capacity")).toBeInTheDocument()
    expect(screen.getByText("Casual")).toBeInTheDocument()

    expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
    expect(screen.getByText(gameSessionScheduleMock.location)).toBeInTheDocument()
    expect(
      screen.getByText(
        `${capitalize(gameSessionScheduleMock.day)} ${formatTime(gameSessionScheduleMock.startTime)} - ${formatTime(gameSessionScheduleMock.endTime)}`,
      ),
    ).toBeInTheDocument()
  })

  it("calls edit and delete actions when clicked", async () => {
    const onEditRow = vi.fn()
    const onDeleteRow = vi.fn()

    const { user } = render(
      <AdminSemestersTable
        data={[gameSessionScheduleMock]}
        onDeleteRow={onDeleteRow}
        onEditRow={onEditRow}
      />,
      { wrapper: withNuqsTestingAdapter() },
    )

    const actionsButton = screen.getByRole("button", { name: /actions/i })
    await user.click(actionsButton)

    await user.click(screen.getByText(/edit/i))
    expect(onEditRow).toHaveBeenCalledTimes(1)
    expect(onEditRow.mock.calls[0][0]).toMatchObject(gameSessionScheduleMock)

    await user.click(actionsButton)
    await user.click(screen.getByText(/delete/i))
    expect(onDeleteRow).toHaveBeenCalledTimes(1)
    expect(onDeleteRow.mock.calls[0][0]).toMatchObject(gameSessionScheduleMock)
  })

  it("should render if no data is provided", () => {
    render(<AdminSemestersTable data={[]} />, { wrapper: withNuqsTestingAdapter() })

    expect(screen.getByText("No sessions found.")).toBeInTheDocument()
  })
})
