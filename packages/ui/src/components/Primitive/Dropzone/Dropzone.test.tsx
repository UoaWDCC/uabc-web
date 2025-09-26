import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "@yamada-ui/react"
import { Dropzone as DropzoneModule } from "./index"

describe("<Dropzone />", () => {
  it("should re-export the Dropzone component with namespace and check if Dropzone exists", () => {
    expect(DropzoneModule).toBeDefined()

    expect(isValidElement(<DropzoneModule />)).toBeTruthy()
  })

  it("should render custom header and description", () => {
    render(<DropzoneModule description="Test description" header="Test header" />)

    expect(screen.getByText("Test header")).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
  })

  it("should use default header and description if they aren't specified", () => {
    render(<DropzoneModule />)

    expect(screen.getByText("Attach file here")).toBeInTheDocument()
    expect(screen.getByText("Drop item here or click to select file")).toBeInTheDocument()
  })
})
