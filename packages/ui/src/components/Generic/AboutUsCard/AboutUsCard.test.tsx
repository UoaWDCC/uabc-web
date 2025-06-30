import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { AboutUsCard } from "./AboutUsCard"

describe("<AboutUsCard />", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test description content",
  }

  it("should have correct displayName", () => {
    expect(AboutUsCard.displayName).toBe("AboutUsCard")
  })

  it("should render title correctly", () => {
    render(<AboutUsCard {...defaultProps} />)

    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()
    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })

  it("should render description correctly", () => {
    render(<AboutUsCard {...defaultProps} />)

    expect(screen.getByText("Test description content")).toBeInTheDocument()
  })

  it("should render both title and description when provided", () => {
    const props = {
      title: "About Our Mission",
      description:
        "We are dedicated to providing excellent badminton services and fostering a community of players.",
    }

    render(<AboutUsCard {...props} />)

    expect(screen.getByText("About Our Mission")).toBeInTheDocument()
    expect(
      screen.getByText(
        "We are dedicated to providing excellent badminton services and fostering a community of players.",
      ),
    ).toBeInTheDocument()
  })

  it("should handle empty strings gracefully", () => {
    const props = {
      title: "",
      description: "",
    }

    render(<AboutUsCard {...props} />)

    // Should still render the heading element even if empty
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()
  })
})
