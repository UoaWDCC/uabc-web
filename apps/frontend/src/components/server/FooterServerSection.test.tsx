import { getFooter } from "@/services/cms/footer/FooterService"
import { render, screen } from "@/test-config/test-utils"
import { FooterServerSection } from "./FooterServerSection"

vi.mock("@/services/cms/footer/FooterService", () => ({
  getFooter: vi.fn(),
}))

const mockedGetFooter = vi.mocked(getFooter)

describe("<FooterServerSection />", () => {
  const mockFooterData = {
    data: {
      id: "footer-1",
      title: "UABC",
      description: "The largest university badminton club in New Zealand!",
      logo: {
        id: "logo-1",
        url: "/api/media/logo.png",
        alt: "UABC Logo",
        width: 200,
        height: 200,
        updatedAt: "2025-01-20T12:00:00Z",
        createdAt: "2025-01-01T00:00:00Z",
      },
      copyright: "© 2025 University of Auckland Badminton Club",
      linktree: "linktr.ee/uoa.badminton",
      facebook: "https://www.facebook.com/groups/uoabadminton/",
      instagram: "https://www.instagram.com/uoa.badminton/",
      linkGroup1: {
        title: "Quick Links",
        links: [
          { id: "1", label: "Home", url: "/" },
          { id: "2", label: "Book a Court", url: "/book" },
          { id: "3", label: "Events", url: "/events" },
        ],
      },
      linkGroup2: {
        title: "UABC",
        links: [
          { id: "4", label: "About Us", url: "/about" },
          { id: "5", label: "Contact Us", url: "/contact" },
          { id: "6", label: "FAQs", url: "/faq" },
        ],
      },
      updatedAt: "2025-01-20T12:00:00Z",
      createdAt: "2025-01-01T00:00:00Z",
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
  })

  it("should render footer with complete data", async () => {
    mockedGetFooter.mockResolvedValue(mockFooterData)

    render(<FooterServerSection />)

    expect(screen.getByText("UABC")).toBeInTheDocument()
    expect(
      screen.getByText("The largest university badminton club in New Zealand!"),
    ).toBeInTheDocument()
    expect(screen.getByText("© 2025 University of Auckland Badminton Club")).toBeInTheDocument()
    expect(screen.getByText("Developed by the 2025 WDCC UABC Team.")).toBeInTheDocument()
  })

  it("should render footer with minimal logo data", async () => {
    const footerDataWithMinimalLogo = {
      data: {
        ...mockFooterData.data,
        logo: {
          id: "logo-1",
          url: "/api/media/logo.png",
          alt: "UABC Logo",
          updatedAt: "2025-01-20T12:00:00Z",
          createdAt: "2025-01-01T00:00:00Z",
        },
      },
    }
    mockedGetFooter.mockResolvedValue(footerDataWithMinimalLogo)

    render(<FooterServerSection />)

    expect(screen.getByText("UABC")).toBeInTheDocument()
    expect(
      screen.getByText("The largest university badminton club in New Zealand!"),
    ).toBeInTheDocument()
  })

  it("should render footer with empty link groups", async () => {
    const footerDataWithEmptyLinks = {
      data: {
        ...mockFooterData.data,
        linkGroup1: { title: "Quick Links", links: [] },
        linkGroup2: { title: "UABC", links: [] },
      },
    }
    mockedGetFooter.mockResolvedValue(footerDataWithEmptyLinks)

    render(<FooterServerSection />)

    expect(screen.getByText("UABC")).toBeInTheDocument()
    expect(
      screen.getByText("The largest university badminton club in New Zealand!"),
    ).toBeInTheDocument()
  })

  it("should render social links correctly", async () => {
    mockedGetFooter.mockResolvedValue(mockFooterData)

    render(<FooterServerSection />)

    const socialLinks = ["LinkTree", "Facebook", "Instagram"]
    for (const link of socialLinks) {
      const elements = screen.getAllByLabelText(link)
      expect(elements.length).toBe(2)
    }
  })

  it("should render quick links correctly", async () => {
    mockedGetFooter.mockResolvedValue(mockFooterData)

    render(<FooterServerSection />)

    const quickLinks = ["Home", "Book a Court", "Events"]
    for (const link of quickLinks) {
      expect(screen.getByText(link)).toBeInTheDocument()
    }
  })

  it("should render UABC links correctly", async () => {
    mockedGetFooter.mockResolvedValue(mockFooterData)

    render(<FooterServerSection />)

    const uabcLinks = ["About Us", "Contact Us", "FAQs"]
    for (const link of uabcLinks) {
      expect(screen.getByText(link)).toBeInTheDocument()
    }
  })

  it("should handle logo with missing optional properties", async () => {
    const footerDataWithPartialLogo = {
      data: {
        ...mockFooterData.data,
        logo: {
          id: "logo-1",
          url: "/api/media/logo.png",
          alt: "UABC Logo",
          updatedAt: "2025-01-20T12:00:00Z",
          createdAt: "2025-01-01T00:00:00Z",
        },
      },
    }
    mockedGetFooter.mockResolvedValue(footerDataWithPartialLogo)

    render(<FooterServerSection />)

    expect(screen.getByText("UABC")).toBeInTheDocument()
    expect(
      screen.getByText("The largest university badminton club in New Zealand!"),
    ).toBeInTheDocument()
  })

  it("should resolve logo URL correctly with API URL", async () => {
    mockedGetFooter.mockResolvedValue(mockFooterData)

    render(<FooterServerSection />)

    expect(screen.getByText("UABC")).toBeInTheDocument()
    expect(
      screen.getByText("The largest university badminton club in New Zealand!"),
    ).toBeInTheDocument()
  })

  it("should call getFooter service", async () => {
    mockedGetFooter.mockResolvedValue(mockFooterData)

    render(<FooterServerSection />)

    expect(mockedGetFooter).toHaveBeenCalledTimes(1)
  })
})
