import { Popup } from "@repo/shared"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { CodeVerificationPopup } from "./CodeVerificationPopup"

const defaultProps = {
  title: "Verify Your Email",
  message: "Please enter the code sent to your email",
  additionalMessage: "The code will expire in 10 minutes.",
}

describe("<CodeVerificationPopup />", () => {
  it("should render and be closed by default if search param is not set", () => {
    render(<CodeVerificationPopup {...defaultProps} />, { wrapper: withNuqsTestingAdapter() })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should open when the search param is set", () => {
    render(<CodeVerificationPopup {...defaultProps} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [Popup.CODE_VERIFICATION]: "open",
        },
      }),
    })
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Verify Your Email")).toBeInTheDocument()
    expect(screen.getByText("Please enter the code sent to your email")).toBeInTheDocument()
  })

  it("should submit the form when the code is entered", async () => {
    const onSubmit = vi.fn()
    const { user } = render(<CodeVerificationPopup {...defaultProps} onSubmit={onSubmit} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [Popup.CODE_VERIFICATION]: "open",
        },
      }),
    })
    const inputs = await screen.findAllByRole("textbox")
    await user.type(inputs[0], "1")
    await user.type(inputs[1], "2")
    await user.type(inputs[2], "3")
    await user.type(inputs[3], "4")
    await user.type(inputs[4], "5")
    await user.type(inputs[5], "6")
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ pinInput: "123456" })
    })
  })
})
