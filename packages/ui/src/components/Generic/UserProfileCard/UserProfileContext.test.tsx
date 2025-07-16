import { InputType } from "@repo/ui/components/Primitive"
import { act, renderHook } from "@repo/ui/test-utils"
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

  it("filters out disabled fields in saveChanges", async () => {
    const testFields = [
      {
        key: "enabledField",
        type: "text",
        label: "Enabled Field",
        inputType: InputType.Text,
      },
      {
        key: "disabledField",
        type: "text",
        label: "Disabled Field",
        inputType: InputType.Text,
        disabled: true,
      },
    ] as const
    const onSave = vi.fn()
    const { result } = renderHook(() => useUserProfile<typeof testFields>(), {
      wrapper: ({ children }) => (
        <UserProfileProvider fields={testFields} onSave={onSave}>
          {children}
        </UserProfileProvider>
      ),
    })
    await act(async () => {
      await result.current.saveChanges({
        enabledField: "enabled value",
        disabledField: "should not be submitted",
      })
    })
    expect(onSave).toHaveBeenCalledWith({ enabledField: "enabled value" })
    expect(onSave).not.toHaveBeenCalledWith(
      expect.objectContaining({ disabledField: expect.anything() }),
    )
  })
})
