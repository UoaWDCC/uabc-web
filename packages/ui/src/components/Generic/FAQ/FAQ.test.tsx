import { createSimpleTextEditorState } from "@repo/ui/test-config/mocks/RichText.mock"
import { fireEvent, render, screen, waitFor } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { FAQ } from "./FAQ"
import * as FAQModule from "./index"
import type { FAQItem } from "./schema"

const mockFAQItems: FAQItem[] = [
  {
    question: "Test Question 1",
    answer: createSimpleTextEditorState("Test Answer 1"),
  },
  {
    question: "Test Question 2",
    answer: createSimpleTextEditorState("Test Answer 2"),
  },
  {
    question: "Disabled Question",
    answer: createSimpleTextEditorState("Disabled Answer"),
    disabled: true,
  },
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
    expect(title).toBeInTheDocument()
    expect(title).toHaveStyle({ color: "var(--ui-colors-red-500)" })
  })

  it("renders empty FAQ when no items provided", () => {
    render(<FAQ items={[]} />)

    expect(screen.getByText("FAQs")).toBeInTheDocument()
    expect(screen.queryByText("Test Question 1")).not.toBeInTheDocument()
  })

  it("handles single FAQ item", () => {
    const singleItem: FAQItem[] = [
      {
        question: "Single Question",
        answer: createSimpleTextEditorState("Single Answer"),
      },
    ]

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

    fireEvent.click(firstQuestion)
    await waitFor(() => {
      expect(screen.getByText("Test Answer 1")).toBeInTheDocument()
    })

    fireEvent.click(firstQuestion)
    await waitFor(() => {
      expect(firstQuestion.closest("button")).toHaveAttribute("aria-expanded", "false")
    })
  })

  it("passes richTextProps to RichText components", () => {
    const richTextProps = {
      textProps: { color: "blue.500" },
      mediaBaseUrl: "https://api.example.com",
    }

    render(<FAQ items={mockFAQItems} richTextProps={richTextProps} />)

    const firstQuestion = screen.getByText("Test Question 1")
    fireEvent.click(firstQuestion)

    expect(screen.getByText("Test Answer 1")).toBeInTheDocument()
  })

  it("handles multiline rich text content correctly", () => {
    const itemsWithMultilineText: FAQItem[] = [
      {
        question: "Multiline Question",
        answer: createSimpleTextEditorState("Line 1\nLine 2\nLine 3"),
      },
    ]

    render(<FAQ items={itemsWithMultilineText} />)

    const question = screen.getByText("Multiline Question")
    fireEvent.click(question)

    expect(screen.getByText("Line 1 Line 2 Line 3")).toBeInTheDocument()
  })
})
