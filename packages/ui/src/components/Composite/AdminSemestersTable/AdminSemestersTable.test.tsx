import { render, screen } from "@repo/ui/test-utils"
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
    )

    expect(screen.getByText("Session Name")).toBeInTheDocument()
    expect(screen.getByText("Time")).toBeInTheDocument()
    expect(screen.getByText("Session Type")).toBeInTheDocument()

    expect(screen.getByText("Session A")).toBeInTheDocument()
    expect(screen.getByText("Session B")).toBeInTheDocument()
  })
})
