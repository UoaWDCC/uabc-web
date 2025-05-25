import { IMAGE_TEST_CONSTANTS } from "@/test-config/mocks/constants"
import { render } from "@/test-utils"
import { isValidElement } from "react"
import * as ImageModule from "./index"

describe("<Image />", () => {
  it("should re-export the Image component and check if Image exists", () => {
    expect(ImageModule.Image).toBeDefined()
    expect(isValidElement(<ImageModule.Image {...IMAGE_TEST_CONSTANTS} />)).toBeTruthy()
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<ImageModule.Image {...IMAGE_TEST_CONSTANTS} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLImageElement)
  })
})
