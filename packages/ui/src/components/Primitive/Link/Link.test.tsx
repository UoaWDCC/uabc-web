import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Link } from "./Link"

describe("<Link />", () => {
  it("should render with valid internal routes", () => {
    render(<Link href="/">Home</Link>)
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument()
  })

  it("should render with valid external URLs", () => {
    render(<Link href="https://example.com">External</Link>)
    const link = screen.getByRole("link", { name: /external/i })
    expect(link).toBeInTheDocument()
  })

  it("should render with custom routes when custom prop is true", () => {
    render(
      <Link custom href="/custom-route">
        Custom Route
      </Link>,
    )
    expect(screen.getByRole("link", { name: /custom route/i })).toBeInTheDocument()
  })

  it("should render with mailto links", () => {
    render(<Link href="mailto:test@example.com">Email</Link>)
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument()
  })

  it("should render with tel links", () => {
    render(<Link href="tel:+1234567890">Phone</Link>)
    expect(screen.getByRole("link", { name: /phone/i })).toBeInTheDocument()
  })

  it("should append query params for internal routes", () => {
    render(
      <Link href="/events" query={{ category: "tennis", page: 2 }}>
        Events
      </Link>,
    )
    const link = screen.getByRole("link", { name: /events/i })
    expect(link).toHaveAttribute("href", expect.stringContaining("/events"))
    expect(link).toHaveAttribute("href", expect.stringContaining("category=tennis"))
    expect(link).toHaveAttribute("href", expect.stringContaining("page=2"))
  })

  it("should append query params for custom internal routes when custom is true", () => {
    render(
      <Link custom href="/custom-route" query={{ foo: "bar", multi: [1, 2] }}>
        Custom With Query
      </Link>,
    )
    const link = screen.getByRole("link", { name: /custom with query/i })
    expect(link).toHaveAttribute("href", expect.stringContaining("/custom-route"))
    expect(link).toHaveAttribute("href", expect.stringContaining("foo=bar"))
    expect(link).toHaveAttribute("href", expect.stringContaining("multi=1"))
    expect(link).toHaveAttribute("href", expect.stringContaining("multi=2"))
  })

  it("should append query params for external URLs", () => {
    render(
      <Link href="https://example.com" query={{ foo: "bar" }}>
        External
      </Link>,
    )
    const link = screen.getByRole("link", { name: /external/i })
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/example\.com\?foo=bar/))
  })
})
