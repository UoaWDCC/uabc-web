import { University } from "@repo/shared/types"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as UniversityInfoFormModule from "../index"
import { UniversityInfoForm } from "../index"
import type { UniversityInfoFormValues } from "../schema"

describe("<UniversityInfoForm />", () => {
  it("should re-export the UniversityInfoForm component and check if UniversityInfoForm exists", () => {
    expect(UniversityInfoFormModule.UniversityInfoForm).toBeDefined()
    expect(isValidElement(<UniversityInfoFormModule.UniversityInfoForm />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(UniversityInfoForm.displayName).toBe("UniversityInfoForm")
  })

  it("should disable the student ID and UPI inputs when the selected university is not UoA", async () => {
    const { user } = render(<UniversityInfoForm />)

    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.aut))

    expect(screen.getByTestId("student-id")).toBeDisabled()
    expect(screen.getByTestId("student-upi")).toBeDisabled()
  })

  it("should call onSubmit when a user clicks the submit button with UoA selected as university and valid data", async () => {
    const handleSubmit = vi.fn((data: UniversityInfoFormValues) => data)

    const { user } = render(<UniversityInfoForm onSubmit={handleSubmit} />)

    const sampleStudentId = "610855188"
    const sampleStudentUpi = "szha069"

    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.uoa))
    await user.type(screen.getByTestId("student-id"), sampleStudentId)
    await user.type(screen.getByTestId("student-upi"), sampleStudentUpi)

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      university: University.uoa,
      studentId: sampleStudentId,
      studentUpi: sampleStudentUpi,
    })
  })

  it("should call onSubmit when a user clicks the submit button with a non-UoA university option and no other data", async () => {
    const handleSubmit = vi.fn((data: UniversityInfoFormValues) => data)

    const { user } = render(<UniversityInfoForm onSubmit={handleSubmit} />)

    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.aut))

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      university: University.aut,
      studentId: "",
      studentUpi: "",
    })
  })

  it("should not call onSubmit when student ID is invalid", async () => {
    const handleSubmit = vi.fn((data: UniversityInfoFormValues) => data)

    const { user } = render(<UniversityInfoForm onSubmit={handleSubmit} />)

    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.uoa))
    await user.type(screen.getByTestId("student-id"), "4612") // Not 9 digits
    await user.type(screen.getByTestId("student-upi"), "szha069")

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })

  it("should not call onSubmit when text input values are invalid", async () => {
    const handleSubmit = vi.fn((data: UniversityInfoFormValues) => data)

    const { user } = render(<UniversityInfoForm onSubmit={handleSubmit} />)

    await user.click(screen.getByTestId("university"))
    await user.click(screen.getByText(University.uoa))
    await user.type(screen.getByTestId("student-id"), "123456789")
    await user.type(screen.getByTestId("student-upi"), "szha1111") // Numerical part is not 3 digits

    const submitButton = screen.getByText("Continue")
    await user.click(submitButton)

    expect(handleSubmit).not.toBeCalled()
  })
})
