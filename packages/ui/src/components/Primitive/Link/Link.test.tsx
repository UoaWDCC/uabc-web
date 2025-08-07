import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Link } from "./Link"

describe("<Link />", () => {
  it("should render with valid internal routes", () => {
    const { container } = render(<Link href="/">Home</Link>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("should render with valid external URLs", () => {
    const { container } = render(<Link href="https://example.com">External</Link>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("should render with custom routes when custom prop is true", () => {
    const { container } = render(
      <Link custom href="/custom-route">
        Custom Route
      </Link>,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it("should render with mailto links", () => {
    const { container } = render(<Link href="mailto:test@example.com">Email</Link>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("should render with tel links", () => {
    const { container } = render(<Link href="tel:+1234567890">Phone</Link>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
