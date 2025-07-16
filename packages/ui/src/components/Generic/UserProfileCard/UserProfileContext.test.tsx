import { InputType } from "@repo/ui/components/Primitive"
import { renderHook } from "@repo/ui/test-utils"
import { UserProfileProvider, useUserProfile } from "./UserProfileContext"

describe("UserProfileContext", () => {
  const fields = [
    {
      key: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      inputType: InputType.Text,
      required: true,
    },
  ] as const

  it("provides editing state and form", () => {
    const { result } = renderHook(() => useUserProfile<typeof fields>(), {
      wrapper: ({ children }) => (
        <UserProfileProvider fields={fields}>{children}</UserProfileProvider>
      ),
    })
    expect(result.current.isEditing).toBe(false)
    expect(result.current.form).toBeDefined()
    expect(typeof result.current.startEditing).toBe("function")
    expect(typeof result.current.cancelEditing).toBe("function")
    expect(typeof result.current.saveChanges).toBe("function")
  })

  it("throws if used outside provider", () => {
    expect(() => renderHook(() => useUserProfile<typeof fields>())).toThrow()
  })
})
