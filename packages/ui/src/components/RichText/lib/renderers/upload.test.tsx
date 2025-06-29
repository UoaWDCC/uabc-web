import { render, screen } from "@testing-library/react"
import type { ImageProps } from "@yamada-ui/react"
import {
  createUploadNodeWithFilenameOnly,
  createUploadNodeWithRelation,
  imageUploadNode,
  invalidUploadNode,
} from "@/test-config/mocks/RichText.mock"
import { renderUploadNode } from "./upload"

describe("renderUploadNode", () => {
  it("should render an image", () => {
    const options = {}
    render(renderUploadNode(imageUploadNode, options))

    const image = screen.getByRole("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/_next/image?url=%2Ftest-image.jpg&w=640&q=75")
    expect(image).toHaveAttribute("alt", "Test Image")
  })

  it("should return null if relationTo is not media", () => {
    const options = {}
    const uploadNode = createUploadNodeWithRelation("documents")
    const { container } = render(renderUploadNode(uploadNode, options))
    expect(container).toBeEmptyDOMElement()
  })

  it("should return null for an invalid upload node", () => {
    const options = {}
    const { container } = render(renderUploadNode(invalidUploadNode, options))
    expect(container).toBeEmptyDOMElement()
  })

  it("should return null if there is no URL", () => {
    const options = {}
    const noUrlUploadNode = createUploadNodeWithFilenameOnly()
    const { container } = render(renderUploadNode(noUrlUploadNode, options))
    expect(container).toBeEmptyDOMElement()
  })

  it("should resolve the URL with mediaBaseUrl", () => {
    const options = { mediaBaseUrl: "https://api.example.com" }
    render(renderUploadNode(imageUploadNode, options))

    const image = screen.getByRole("img")
    expect(image).toHaveAttribute(
      "src",
      "/_next/image?url=https%3A%2F%2Fapi.example.com%2Ftest-image.jpg&w=640&q=75",
    )
  })

  it("should pass imageProps to the Image component", () => {
    const options = { imageProps: { "data-testid": "custom-image" } as ImageProps }
    render(renderUploadNode(imageUploadNode, options))

    const image = screen.getByTestId("custom-image")
    expect(image).toBeInTheDocument()
  })
})
