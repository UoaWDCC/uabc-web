import { render, screen } from "@repo/ui/test-utils"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import { isValidElement } from "react"
import { AdminSemestersTable } from "./AdminSemestersTable"

describe("<AdminSemestersTable />", () => {
  it("should be defined and have displayName", () => {
    expect(AdminSemestersTable).toBeDefined()
    expect(AdminSemestersTable.displayName).toBe("AdminSemestersTable")
  })

  it("renders rows and columns", () => {
    expect(
      isValidElement(
        <AdminSemestersTable
          data={[
            { id: "1", sessionName: "Session A", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
          ]}
        />,
      ),
    ).toBeTruthy()

    render(
      <AdminSemestersTable
        data={[
          { id: "1", sessionName: "Session A", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
          { id: "2", sessionName: "Session B", time: "7:00pm - 9:00pm", sessionType: "Upcoming" },
        ]}
      />,
      { wrapper: ({ children }) => <NuqsTestingAdapter>{children}</NuqsTestingAdapter> },
    )

    expect(screen.getByText("Session Name")).toBeInTheDocument()
    expect(screen.getByText("Time")).toBeInTheDocument()
    expect(screen.getByText("Session Type")).toBeInTheDocument()

    expect(screen.getByText("Session A")).toBeInTheDocument()
    expect(screen.getByText("Session B")).toBeInTheDocument()
  })

  it("calls edit and delete actions when clicked", async () => {
    const onEditRow = vi.fn()
    const onDeleteRow = vi.fn()

    const { user } = render(
      <AdminSemestersTable
        data={[
          { id: "1", sessionName: "Session A", time: "7:30pm - 10:00pm", sessionType: "Ongoing" },
        ]}
        onDeleteRow={onDeleteRow}
        onEditRow={onEditRow}
      />,
      { wrapper: ({ children }) => <NuqsTestingAdapter>{children}</NuqsTestingAdapter> },
    )

    // Open actions menu
    const actionsButton = screen.getByRole("button", { name: /actions/i })
    await user.click(actionsButton)

    // Click Edit
    await user.click(screen.getByText(/edit/i))
    expect(onEditRow).toHaveBeenCalledTimes(1)
    expect(onEditRow.mock.calls[0][0]).toMatchObject({ id: "1" })

    // Re-open and click Delete
    await user.click(actionsButton)
    await user.click(screen.getByText(/delete/i))
    expect(onDeleteRow).toHaveBeenCalledTimes(1)
    expect(onDeleteRow.mock.calls[0][0]).toMatchObject({ id: "1" })
  })
})
