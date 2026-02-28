import { gameSessionScheduleMock, semesterMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { useBreakpointValue } from "@yamada-ui/react"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { AdminSemestersAccordion } from "./AdminSemestersAccordion"

vi.mock("@yamada-ui/react", async (importActual) => {
  const actual = await importActual<typeof import("@yamada-ui/react")>()
  return {
    ...actual,
    useBreakpointValue: vi.fn(),
  }
})

const mockUseBreakpointValue = vi.mocked(useBreakpointValue)

describe("<AdminSemestersAccordion />", () => {
  beforeEach(() => {
    mockUseBreakpointValue.mockReturnValue(true)
  })

  it("renders the semester name", () => {
    render(<AdminSemestersAccordion semester={semesterMock} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getAllByText(semesterMock.name).length).toBeGreaterThan(0)
  })

  it("renders the Add New Session button", () => {
    render(<AdminSemestersAccordion defaultExpanded semester={semesterMock} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByRole("button", { name: /add new session/i })).toBeInTheDocument()
  })

  it("calls onAddSchedule when Add New Session is clicked", async () => {
    const onAddSchedule = vi.fn()

    const { user } = render(
      <AdminSemestersAccordion
        defaultExpanded
        onAddSchedule={onAddSchedule}
        semester={semesterMock}
      />,
      { wrapper: withNuqsTestingAdapter() },
    )

    await user.click(screen.getByRole("button", { name: /add new session/i }))

    expect(onAddSchedule).toHaveBeenCalledTimes(1)
  })

  it("calls onEditSemester with semester id when Edit is clicked", async () => {
    const onEditSemester = vi.fn()

    const { user } = render(
      <AdminSemestersAccordion
        defaultExpanded
        onEditSemester={onEditSemester}
        semester={semesterMock}
      />,
      { wrapper: withNuqsTestingAdapter() },
    )

    await user.click(screen.getByRole("button", { name: /semester actions/i }))
    await user.click(screen.getByText("Edit"))

    expect(onEditSemester).toHaveBeenCalledWith(semesterMock.id)
  })

  it("calls onDeleteSemester with semester id when Delete is clicked", async () => {
    const onDeleteSemester = vi.fn()

    const { user } = render(
      <AdminSemestersAccordion
        defaultExpanded
        onDeleteSemester={onDeleteSemester}
        semester={semesterMock}
      />,
      { wrapper: withNuqsTestingAdapter() },
    )

    await user.click(screen.getByRole("button", { name: /semester actions/i }))
    await user.click(screen.getByText("Delete"))

    expect(onDeleteSemester).toHaveBeenCalledWith(semesterMock.id)
  })

  it("renders empty rows without crashing", () => {
    render(<AdminSemestersAccordion defaultExpanded rows={[]} semester={semesterMock} />, {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(screen.getByRole("button", { name: /add new session/i })).toBeInTheDocument()
  })

  describe("on desktop", () => {
    beforeEach(() => {
      mockUseBreakpointValue.mockReturnValue(true)
    })

    it("renders AdminSemestersTable with rows", () => {
      render(
        <AdminSemestersAccordion
          defaultExpanded
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        { wrapper: withNuqsTestingAdapter() },
      )

      expect(screen.getByRole("table")).toBeInTheDocument()
      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
    })

    it("calls onEditSchedule when table edit action is clicked", async () => {
      const onEditSchedule = vi.fn()

      const { user } = render(
        <AdminSemestersAccordion
          defaultExpanded
          onEditSchedule={onEditSchedule}
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        { wrapper: withNuqsTestingAdapter() },
      )

      await user.click(screen.getByRole("button", { name: /^actions$/i }))
      await user.click(screen.getByText("Edit"))

      expect(onEditSchedule).toHaveBeenCalledTimes(1)
      expect(onEditSchedule.mock.calls[0][0]).toMatchObject(gameSessionScheduleMock)
    })

    it("calls onDeleteSchedule when table delete action is clicked", async () => {
      const onDeleteSchedule = vi.fn()

      const { user } = render(
        <AdminSemestersAccordion
          defaultExpanded
          onDeleteSchedule={onDeleteSchedule}
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        { wrapper: withNuqsTestingAdapter() },
      )

      await user.click(screen.getByRole("button", { name: /^actions$/i }))
      await user.click(screen.getByText("Delete"))

      expect(onDeleteSchedule).toHaveBeenCalledWith(gameSessionScheduleMock.id)
    })
  })

  describe("on mobile", () => {
    beforeEach(() => {
      mockUseBreakpointValue.mockReturnValue(false)
    })

    it("renders GameSessionScheduleCards instead of a table", () => {
      render(
        <AdminSemestersAccordion
          defaultExpanded
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        { wrapper: withNuqsTestingAdapter() },
      )

      expect(screen.queryByRole("table")).not.toBeInTheDocument()
      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
    })

    it("renders a card per row", () => {
      const secondSchedule = { ...gameSessionScheduleMock, id: "another-id", name: "Court B" }

      render(
        <AdminSemestersAccordion
          defaultExpanded
          rows={[gameSessionScheduleMock, secondSchedule]}
          semester={semesterMock}
        />,
        { wrapper: withNuqsTestingAdapter() },
      )

      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
      expect(screen.getByText(secondSchedule.name)).toBeInTheDocument()
    })
  })
})
