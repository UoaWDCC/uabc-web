import { gameSessionScheduleMock, semesterMock } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { Accordion, useBreakpointValue } from "@yamada-ui/react"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { AdminSemestersAccordionItem } from "./AdminSemestersAccordionItem"

vi.mock("@yamada-ui/react", async (importActual) => {
  const actual = await importActual<typeof import("@yamada-ui/react")>()
  return {
    ...actual,
    useBreakpointValue: vi.fn(),
  }
})

const mockUseBreakpointValue = vi.mocked(useBreakpointValue)

const renderInAccordion = (ui: React.ReactElement, expanded = false) =>
  render(
    <Accordion defaultIndex={expanded ? [0] : []} multiple>
      {ui}
    </Accordion>,
    { wrapper: withNuqsTestingAdapter() },
  )

describe("<AdminSemestersAccordionItem />", () => {
  beforeEach(() => {
    mockUseBreakpointValue.mockReturnValue(true)
  })

  it("renders the semester name", () => {
    renderInAccordion(<AdminSemestersAccordionItem semester={semesterMock} />)

    expect(screen.getAllByText(semesterMock.name).length).toBeGreaterThan(0)
  })

  it("renders the Add New Session button when expanded", () => {
    renderInAccordion(<AdminSemestersAccordionItem semester={semesterMock} />, true)

    expect(screen.getByRole("button", { name: /add new session/i })).toBeInTheDocument()
  })

  it("calls onAddSchedule when Add New Session is clicked", async () => {
    const onAddSchedule = vi.fn()

    const { user } = renderInAccordion(
      <AdminSemestersAccordionItem onAddSchedule={onAddSchedule} semester={semesterMock} />,
      true,
    )

    await user.click(screen.getByRole("button", { name: /add new session/i }))

    expect(onAddSchedule).toHaveBeenCalledTimes(1)
  })

  it("calls onEditSemester with semester id when Edit is clicked", async () => {
    const onEditSemester = vi.fn()

    const { user } = renderInAccordion(
      <AdminSemestersAccordionItem onEditSemester={onEditSemester} semester={semesterMock} />,
      true,
    )

    await user.click(screen.getByRole("button", { name: /semester actions/i }))
    await user.click(screen.getByText("Edit"))

    expect(onEditSemester).toHaveBeenCalledWith(semesterMock.id)
  })

  it("calls onDeleteSemester with semester id when Delete is clicked", async () => {
    const onDeleteSemester = vi.fn()

    const { user } = renderInAccordion(
      <AdminSemestersAccordionItem onDeleteSemester={onDeleteSemester} semester={semesterMock} />,
      true,
    )

    await user.click(screen.getByRole("button", { name: /semester actions/i }))
    await user.click(screen.getByText("Delete"))

    expect(onDeleteSemester).toHaveBeenCalledWith(semesterMock.id)
  })

  it("renders empty rows without crashing", () => {
    renderInAccordion(<AdminSemestersAccordionItem rows={[]} semester={semesterMock} />, true)

    expect(screen.getByRole("button", { name: /add new session/i })).toBeInTheDocument()
  })

  it("fires Accordion onChange when the item is toggled", async () => {
    const onChange = vi.fn()

    const { user } = render(
      <Accordion multiple onChange={onChange}>
        <AdminSemestersAccordionItem semester={semesterMock} />
      </Accordion>,
      { wrapper: withNuqsTestingAdapter() },
    )

    await user.click(screen.getByRole("button", { name: semesterMock.name }))

    expect(onChange).toHaveBeenCalled()
  })

  describe("on desktop", () => {
    beforeEach(() => {
      mockUseBreakpointValue.mockReturnValue(true)
    })

    it("renders AdminSemestersTable with rows", () => {
      renderInAccordion(
        <AdminSemestersAccordionItem rows={[gameSessionScheduleMock]} semester={semesterMock} />,
        true,
      )

      expect(screen.getByRole("table")).toBeInTheDocument()
      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
    })

    it("calls onEditSchedule when table edit action is clicked", async () => {
      const onEditSchedule = vi.fn()

      const { user } = renderInAccordion(
        <AdminSemestersAccordionItem
          onEditSchedule={onEditSchedule}
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        true,
      )

      await user.click(screen.getByRole("button", { name: /^actions$/i }))
      await user.click(screen.getByText("Edit"))

      expect(onEditSchedule).toHaveBeenCalledTimes(1)
      expect(onEditSchedule.mock.calls[0][0]).toMatchObject(gameSessionScheduleMock)
    })

    it("calls onDeleteSchedule when table delete action is clicked", async () => {
      const onDeleteSchedule = vi.fn()

      const { user } = renderInAccordion(
        <AdminSemestersAccordionItem
          onDeleteSchedule={onDeleteSchedule}
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        true,
      )

      await user.click(screen.getByRole("button", { name: /^actions$/i }))
      await user.click(screen.getByText("Delete"))

      expect(onDeleteSchedule).toHaveBeenCalledWith(gameSessionScheduleMock.id)
    })

    it("renders SkeletonTable when isLoading is true", () => {
      renderInAccordion(
        <AdminSemestersAccordionItem isLoading rows={[]} semester={semesterMock} />,
        true,
      )

      expect(screen.getByRole("table")).toBeInTheDocument()
      expect(screen.queryByText("No sessions found.")).not.toBeInTheDocument()
    })

    it("renders the table with data when isLoading is false", () => {
      renderInAccordion(
        <AdminSemestersAccordionItem
          isLoading={false}
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        true,
      )

      expect(screen.getByRole("table")).toBeInTheDocument()
      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
    })
  })

  describe("on mobile", () => {
    beforeEach(() => {
      mockUseBreakpointValue.mockReturnValue(false)
    })

    it("renders GameSessionScheduleCards instead of a table", () => {
      renderInAccordion(
        <AdminSemestersAccordionItem rows={[gameSessionScheduleMock]} semester={semesterMock} />,
        true,
      )

      expect(screen.queryByRole("table")).not.toBeInTheDocument()
      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
    })

    it("renders a card per row", () => {
      const secondSchedule = { ...gameSessionScheduleMock, id: "another-id", name: "Court B" }

      renderInAccordion(
        <AdminSemestersAccordionItem
          rows={[gameSessionScheduleMock, secondSchedule]}
          semester={semesterMock}
        />,
        true,
      )

      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
      expect(screen.getByText(secondSchedule.name)).toBeInTheDocument()
    })

    it("renders a loading spinner when isLoading is true", () => {
      renderInAccordion(
        <AdminSemestersAccordionItem isLoading rows={[]} semester={semesterMock} />,
        true,
      )

      expect(screen.queryByRole("table")).not.toBeInTheDocument()
      expect(screen.queryByText(gameSessionScheduleMock.name)).not.toBeInTheDocument()
      expect(document.querySelector(".ui-loading")).toBeInTheDocument()
    })

    it("renders cards when isLoading is false", () => {
      renderInAccordion(
        <AdminSemestersAccordionItem
          isLoading={false}
          rows={[gameSessionScheduleMock]}
          semester={semesterMock}
        />,
        true,
      )

      expect(screen.queryByRole("table")).not.toBeInTheDocument()
      expect(screen.getByText(gameSessionScheduleMock.name)).toBeInTheDocument()
      expect(document.querySelector(".ui-loading")).not.toBeInTheDocument()
    })
  })
})
