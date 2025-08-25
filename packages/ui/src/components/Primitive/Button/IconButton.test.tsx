import { render } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as ButtonModule from "./index"

describe("<IconButton />", () => {
  it("should re-export the IconButton component and check if IconButton exists", () => {
    expect(ButtonModule.IconButton).toBeDefined()
    expect(isValidElement(<ButtonModule.IconButton />)).toBe(true)
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<ButtonModule.IconButton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
