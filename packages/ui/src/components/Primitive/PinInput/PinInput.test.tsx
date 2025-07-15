import { render, screen } from "@repo/ui/test-utils"
import { FormControl } from "@yamada-ui/react"
import { isValidElement } from "react"
import * as PinInputModule from "./index"
import { PinInput } from "./PinInput"

describe("<PinInput />", () => {
  it("should re-export the PinInput component and check if PinInput exists", () => {
    expect(PinInputModule.PinInput).toBeDefined()
    expect(isValidElement(<PinInputModule.PinInput />)).toBeTruthy()
  })

  it("renders with basic props", () => {
    render(
      <FormControl label="Verification Code">
        <PinInput items={4} />
      </FormControl>,
    )
    expect(screen.getByText("Verification Code")).toBeInTheDocument()
  })

  it("forwards ref correctly", () => {
    const ref = { current: null }
    render(<PinInput items={4} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
