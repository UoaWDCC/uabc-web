import {
  createUploadNodeWithFilenameOnly,
  createUploadNodeWithRelation,
  imageUploadNode,
  invalidUploadNode,
} from "@repo/ui/test-config/mocks/RichText.mock"
import { render, screen } from "@testing-library/react"
import type { ImageProps } from "@yamada-ui/react"
import { renderUploadNode } from "./upload"

describe("renderUploadNode", () => {
  it("should render an image", () => {
    const options = {}
    render(renderUploadNode(imageUploadNode, "test-key", options))

    const image = screen.getByRole("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/test-image.jpg")
    expect(image).toHaveAttribute("alt", "Test Image")
  })

  it("should return null if relationTo is not media", () => {
    const options = {}
    const uploadNode = createUploadNodeWithRelation("documents")
    const { container } = render(renderUploadNode(uploadNode, "test-key", options))
    expect(container).toBeEmptyDOMElement()
  })

  it("should return null for an invalid upload node", () => {
    const options = {}
    const { container } = render(renderUploadNode(invalidUploadNode, "test-key", options))
    expect(container).toBeEmptyDOMElement()
  })

  it("should return null if there is no URL", () => {
    const options = {}
    const noUrlUploadNode = createUploadNodeWithFilenameOnly()
    const { container } = render(renderUploadNode(noUrlUploadNode, "test-key", options))
    expect(container).toBeEmptyDOMElement()
  })

  it("should resolve the URL with mediaBaseUrl", () => {
    const options = { mediaBaseUrl: "https://api.example.com" }
    render(renderUploadNode(imageUploadNode, "test-key", options))

    const image = screen.getByRole("img")
    expect(image).toHaveAttribute("src", "https://api.example.com/test-image.jpg")
  })

  it("should pass imageProps to the Image component", () => {
    const options = { imageProps: { "data-testid": "custom-image" } as ImageProps }
    render(renderUploadNode(imageUploadNode, "test-key", options))

    const image = screen.getByTestId("custom-image")
    expect(image).toBeInTheDocument()
  })
})
