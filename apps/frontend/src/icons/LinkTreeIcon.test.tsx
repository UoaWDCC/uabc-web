import { render } from "@/test-config/test-utils"
import { LinkTreeIcon } from "./LinkTreeIcon"

describe("<LinkTreeIcon />", () => {
  it("should be memoized", () => {
    const { rerender } = render(<LinkTreeIcon />)
    const firstRender = render(<LinkTreeIcon />)
    rerender(<LinkTreeIcon />)
    expect(firstRender).toMatchSnapshot()
  })

  it("should have correct displayName", () => {
    expect(LinkTreeIcon.displayName).toBe("LinkTreeIcon")
  })
})
