vi.mock("next/image", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: this is for a test
  default: (props: Record<string, any> = {}) => {
    let { alt = "", src, ...rest } = props || {}
    if (src && typeof src === "object" && "src" in src) {
      src = src.src
    }
    // biome-ignore lint/nursery/noImgElement: this is for a test
    return <img {...rest} alt={alt} data-testid="next-image" src={src} />
  },
}))
