import { render } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as ButtonModule from "./index"

describe("<Button />", () => {
  it("should re-export the Button component and check if Button exists", () => {
    expect(ButtonModule.Button).toBeDefined()
    expect(isValidElement(<ButtonModule.Button />)).toBe(true)
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<ButtonModule.Button ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
