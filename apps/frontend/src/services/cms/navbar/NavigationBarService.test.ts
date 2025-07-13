import { GetNavbarResponseSchema } from "@repo/shared"
import type { Navbar } from "@repo/shared/payload-types"
import { getNavigationBar } from "./NavigationBarService"

const mockNavbar: Navbar = {
  id: "1",
  logo: "logo.png",
  navItems: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ],
  rightSideSingleButton: { label: "Login", url: "/login" },
}

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(GetNavbarResponseSchema.parse({ data: mockNavbar })),
    }),
  ),
)

describe("getNavigationBar", () => {
  it("should return faq", async () => {
    const response = await getNavigationBar()

    expect(response).toEqual({ data: { data: mockNavbar }, isError: false })
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/globals/navbar",
      expect.any(Object),
    )
  })
})
