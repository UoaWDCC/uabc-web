import { render, screen } from "@/test-config/test-utils"
import Home from "./page"

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

describe("<Home />", () => {
  it("should export the Home component", () => {
    expect(Home).toBeDefined()
    expect(Home).toBeTruthy()
  })

  it("should render the home page", async () => {
    const HomeComponent = await Home()
    render(HomeComponent)
    expect(screen.getByText("UNIVERSITY OF AUCKLAND BADMINTON CLUB")).toBeInTheDocument()
    expect(screen.getByText("We are UABC.")).toBeInTheDocument()
    expect(screen.getByText("NZ's Largest Student")).toBeInTheDocument()
    expect(screen.getByText("Badminton Club.")).toBeInTheDocument()
    expect(
      screen.getByText(
        "We run weekly badminton sessions and fun social events to connect like-minded badminton people! Join our sessions or check our Instagram page for events! 🏸",
      ),
    ).toBeInTheDocument()
  })

  it("should render the quick book component", async () => {
    const HomeComponent = await Home()
    render(HomeComponent)
    expect(screen.getByText("Quick Book")).toBeInTheDocument()
    expect(screen.getAllByRole("combobox")).toHaveLength(2)
    expect(screen.getByText("Book Now")).toBeInTheDocument()
  })

  it("should render the location bubbles", async () => {
    const HomeComponent = await Home()
    render(HomeComponent)
    const locationBubbles = screen.getAllByTestId("location-bubble-circle-trigger")
    expect(locationBubbles).toHaveLength(3)
  })

  it("should render the about us section", async () => {
    const HomeComponent = await Home()
    render(HomeComponent)
    expect(screen.getByText("About Us")).toBeInTheDocument()
    expect(screen.getByTestId("about-us-carousel")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute("href", "/about")
  })

  it("should render the faq section", async () => {
    const HomeComponent = await Home()
    render(HomeComponent)
    expect(screen.getByText("FAQs")).toBeInTheDocument()
  })
})
