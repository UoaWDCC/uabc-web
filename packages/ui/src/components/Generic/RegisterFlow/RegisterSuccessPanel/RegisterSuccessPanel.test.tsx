import { isValidElement } from "react"
import * as RegisterSuccessPanelModule from "./index"
import { RegisterSuccessPanel } from "./index"

describe("<RegisterSuccessPanel />", () => {
  it("should re-export the RegisterSuccessPanel component and check if RegisterSuccessPanel exists", () => {
    expect(RegisterSuccessPanelModule.RegisterSuccessPanel).toBeDefined()
    expect(isValidElement(<RegisterSuccessPanelModule.RegisterSuccessPanel />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(RegisterSuccessPanel.displayName).toBe("RegisterSuccessPanel")
  })
})
