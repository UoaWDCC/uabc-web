import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import { Header } from "./Header"

describe("<Header />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<Header />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(Header.displayName).toBe("Header")
  })

  it("should render with no props", () => {
    const { container } = render(<Header />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("should render title when provided", () => {
    render(<Header title="Test Title" />)
    expect(screen.getByRole("heading", { level: 3, name: "Test Title" })).toBeInTheDocument()
  })

  it("should render subtitle when provided", () => {
    render(<Header subtitle="Test Subtitle" />)
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument()
  })

  it("should render both title and subtitle", () => {
    render(<Header subtitle="Test Subtitle" title="Test Title" />)
    expect(screen.getByRole("heading", { level: 3, name: "Test Title" })).toBeInTheDocument()
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument()
  })

  it("should render children when provided", () => {
    render(
      <Header>
        <div>Custom content</div>
      </Header>,
    )
    expect(screen.getByText("Custom content")).toBeInTheDocument()
  })

  it("should render all props together", () => {
    render(
      <Header subtitle="Sub Title" title="Main Title">
        <div>Additional content</div>
      </Header>,
    )
    expect(screen.getByRole("heading", { level: 3, name: "Main Title" })).toBeInTheDocument()
    expect(screen.getByText("Sub Title")).toBeInTheDocument()
    expect(screen.getByText("Additional content")).toBeInTheDocument()
  })

  it("should render React elements as title", () => {
    render(<Header title={<span>React Element Title</span>} />)
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()
    expect(screen.getByText("React Element Title")).toBeInTheDocument()
  })

  it("should render React elements as subtitle", () => {
    render(<Header subtitle={<em>Emphasized subtitle</em>} />)
    expect(screen.getByText("Emphasized subtitle")).toBeInTheDocument()
  })
})
