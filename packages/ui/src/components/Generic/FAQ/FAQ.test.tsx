import { createSimpleSharedFAQItem } from "@repo/ui/test-config/mocks/FAQ.mock"
import { fireEvent, render, screen, waitFor } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { FAQ } from "./FAQ"
import * as FAQModule from "./index"
import type { UIFAQItem } from "./schema"

const mockFAQItems: UIFAQItem[] = [
  createSimpleSharedFAQItem("Test Question 1", "Test Answer 1"),
  createSimpleSharedFAQItem("Test Question 2", "Test Answer 2"),
  createSimpleSharedFAQItem("Disabled Question", "Disabled Answer", { disabled: true }),
]

describe("<FAQ />", () => {
  it("should re-export the FAQ component and check if FAQ exists", () => {
    expect(FAQModule.FAQ).toBeDefined()
    expect(isValidElement(<FAQModule.FAQ items={[]} />)).toBeTruthy()
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<FAQ items={mockFAQItems} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("renders with default title", () => {
    render(<FAQ items={mockFAQItems} />)
    expect(screen.getByText("FAQs")).toBeInTheDocument()
  })

  it("renders with custom title", () => {
    render(<FAQ items={mockFAQItems} title="Custom FAQ Title" />)
    expect(screen.getByText("Custom FAQ Title")).toBeInTheDocument()
  })

  it("renders without title when title is empty", () => {
    render(<FAQ items={mockFAQItems} title="" />)
    expect(screen.queryByText("FAQs")).not.toBeInTheDocument()
  })

  it("renders all FAQ items", () => {
    render(<FAQ items={mockFAQItems} />)

    expect(screen.getByText("Test Question 1")).toBeInTheDocument()
    expect(screen.getByText("Test Question 2")).toBeInTheDocument()
    expect(screen.getByText("Disabled Question")).toBeInTheDocument()
  })

  it("shows answers when accordion items are clicked", () => {
    render(<FAQ items={mockFAQItems} />)

    const firstQuestion = screen.getByText("Test Question 1")
    fireEvent.click(firstQuestion)

    expect(screen.getByText("Test Answer 1")).toBeInTheDocument()
  })

  it("handles disabled FAQ items", () => {
    render(<FAQ items={mockFAQItems} />)

    const disabledQuestion = screen.getByText("Disabled Question")

    expect(disabledQuestion.closest("button")).toBeDisabled()
  })

  it("supports multiple expansion when allowMultiple is true", () => {
    render(<FAQ allowMultiple items={mockFAQItems} />)

    const firstQuestion = screen.getByText("Test Question 1")
    const secondQuestion = screen.getByText("Test Question 2")

    fireEvent.click(firstQuestion)
    fireEvent.click(secondQuestion)

    expect(screen.getByText("Test Answer 1")).toBeInTheDocument()
    expect(screen.getByText("Test Answer 2")).toBeInTheDocument()
  })

  it("applies custom title props", () => {
    render(<FAQ items={mockFAQItems} titleProps={{ color: "red.500", fontSize: "2xl" }} />)

    const title = screen.getByText("FAQs")
    expect(title).toHaveStyle({ color: "var(--ui-colors-red-500)" })
  })

  it("renders empty FAQ when no items provided", () => {
    render(<FAQ items={[]} />)

    expect(screen.getByText("FAQs")).toBeInTheDocument()

    const accordionItems = screen.queryAllByRole("button", { expanded: false })
    expect(accordionItems).toHaveLength(0)
  })

  it("handles single FAQ item", () => {
    const singleItem: UIFAQItem[] = [createSimpleSharedFAQItem("Single Question", "Single Answer")]

    render(<FAQ items={singleItem} />)

    expect(screen.getByText("Single Question")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Single Question"))
    expect(screen.getByText("Single Answer")).toBeInTheDocument()
  })

  it("passes through accordion props", () => {
    render(<FAQ data-testid="faq-accordion" items={mockFAQItems} variant="card" />)

    expect(screen.getByTestId("faq-accordion")).toBeInTheDocument()
  })

  it("handles toggle behavior correctly", async () => {
    render(<FAQ allowToggle items={mockFAQItems} />)

    const firstQuestion = screen.getByText("Test Question 1")
    const firstQuestionButton = firstQuestion.closest("button")

    expect(firstQuestionButton).toHaveAttribute("aria-expanded", "false")

    fireEvent.click(firstQuestion)
    await waitFor(() => {
      expect(screen.getByText("Test Answer 1")).toBeInTheDocument()
      expect(firstQuestionButton).toHaveAttribute("aria-expanded", "true")
    })

    fireEvent.click(firstQuestion)
    expect(firstQuestionButton).toHaveAttribute("aria-expanded", "false")
  })

  it("passes richTextProps to RichText components", () => {
    const richTextProps = {
      textProps: { color: "blue.500" },
    }

    render(<FAQ items={mockFAQItems} richTextProps={richTextProps} />)

    const firstQuestion = screen.getByText("Test Question 1")
    fireEvent.click(firstQuestion)

    expect(screen.getByText("Test Answer 1")).toHaveStyle({ color: "var(--ui-colors-blue-500)" })
  })

  it("handles multiline rich text content correctly", () => {
    const itemsWithMultilineText: UIFAQItem[] = [
      createSimpleSharedFAQItem("Multiline Question", "Line 1\nLine 2\nLine 3"),
    ]

    render(<FAQ items={itemsWithMultilineText} />)

    const question = screen.getByText("Multiline Question")
    fireEvent.click(question)

    expect(screen.getByText("Line 1 Line 2 Line 3")).toBeInTheDocument()
  })
})
