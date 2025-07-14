import { render, screen } from "@repo/ui/test-utils"
import { Option } from "@yamada-ui/react"
import { isValidElement } from "react"
import * as MultiSelectModule from "./index"
import { MultiSelect } from "./MultiSelect"

describe("<MultiSelect />", () => {
  it("should re-export the MultiSelect component and check if MultiSelect exists", () => {
    expect(MultiSelectModule.MultiSelect).toBeDefined()
    expect(isValidElement(<MultiSelectModule.MultiSelect />)).toBeTruthy()
  })

  it("renders with left icon", () => {
    render(<MultiSelect icon={<>I am icon</>} />)

    expect(screen.getByText("I am icon")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<MultiSelect label="I am label" />)

    expect(screen.getByText("I am label")).toBeInTheDocument()
  })

  it("calls onChange when an option is selected by a user", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <MultiSelect onChange={onChange}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MultiSelect>,
    )

    const multiSelectComponent = screen.getByRole("combobox")

    await user.click(multiSelectComponent)
    await user.click(screen.getByText("Option 1"))
    await user.click(screen.getByText("Option 2"))
    expect(onChange).toBeCalledWith(["1", "2"])
  })
})

describe("registration prop integration", () => {
  it("applies registration props when registration is provided", async () => {
    const mockOnChange = vi.fn()
    const mockOnBlur = vi.fn()
    const mockRef = vi.fn()
    const mockRegistration = {
      name: "test-multiselect",
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      ref: mockRef,
    }
    const { user } = render(
      <MultiSelect label="Label" registration={mockRegistration}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MultiSelect>,
    )
    const multiSelectComponent = screen.getByRole("combobox")
    await user.click(multiSelectComponent)
    await user.click(screen.getByText("Option 1"))
    await user.click(screen.getByText("Option 2"))
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: "test-multiselect", value: ["1", "2"] },
      type: "change",
    })
    await user.click(multiSelectComponent)
    multiSelectComponent.blur()
    expect(mockOnBlur).toHaveBeenCalled()
    expect(mockRef).toHaveBeenCalled()
  })

  it("falls back to component ref when registration ref is undefined", () => {
    const componentRef = { current: null }
    const mockRegistration = {
      name: "test-multiselect",
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: undefined,
      // biome-ignore lint/suspicious/noExplicitAny: testing
    } as any
    render(
      <MultiSelect label="Label" ref={componentRef} registration={mockRegistration}>
        <Option value="1">Option 1</Option>
      </MultiSelect>,
    )
    expect(componentRef.current).toBeInstanceOf(HTMLSelectElement)
  })

  it("falls back to component ref when registration ref is null", () => {
    const componentRef = { current: null }
    const mockRegistration = {
      name: "test-multiselect",
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: null,
      // biome-ignore lint/suspicious/noExplicitAny: testing
    } as any
    render(
      <MultiSelect label="Label" ref={componentRef} registration={mockRegistration}>
        <Option value="1">Option 1</Option>
      </MultiSelect>,
    )
    expect(componentRef.current).toBeInstanceOf(HTMLSelectElement)
  })

  it("calls both component onChange and registration onChange when both are provided", async () => {
    const componentOnChange = vi.fn()
    const registrationOnChange = vi.fn()
    const mockRegistration = {
      name: "test-multiselect",
      onChange: registrationOnChange,
      onBlur: vi.fn(),
      ref: vi.fn(),
    }
    const { user } = render(
      <MultiSelect label="Label" onChange={componentOnChange} registration={mockRegistration}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
      </MultiSelect>,
    )
    const multiSelectComponent = screen.getByRole("combobox")
    await user.click(multiSelectComponent)
    await user.click(screen.getByText("Option 1"))
    expect(componentOnChange).toHaveBeenCalledWith(["1"])
    expect(registrationOnChange).toHaveBeenCalledWith({
      target: { name: "test-multiselect", value: ["1"] },
      type: "change",
    })
  })

  it("calls only component onChange when registration onChange is not provided", async () => {
    const componentOnChange = vi.fn()
    const mockRegistration = {
      name: "test-multiselect",
      onBlur: vi.fn(),
      ref: vi.fn(),
      // biome-ignore lint/suspicious/noExplicitAny: testing
    } as any
    const { user } = render(
      <MultiSelect label="Label" onChange={componentOnChange} registration={mockRegistration}>
        <Option value="1">Option 1</Option>
      </MultiSelect>,
    )
    const multiSelectComponent = screen.getByRole("combobox")
    await user.click(multiSelectComponent)
    await user.click(screen.getByText("Option 1"))
    expect(componentOnChange).toHaveBeenCalledWith(["1"])
  })

  it("calls only registration onChange when component onChange is not provided", async () => {
    const registrationOnChange = vi.fn()
    const mockRegistration = {
      name: "test-multiselect",
      onChange: registrationOnChange,
      onBlur: vi.fn(),
      ref: vi.fn(),
    }
    const { user } = render(
      <MultiSelect label="Label" registration={mockRegistration}>
        <Option value="1">Option 1</Option>
      </MultiSelect>,
    )
    const multiSelectComponent = screen.getByRole("combobox")
    await user.click(multiSelectComponent)
    await user.click(screen.getByText("Option 1"))
    expect(registrationOnChange).toHaveBeenCalledWith({
      target: { name: "test-multiselect", value: ["1"] },
      type: "change",
    })
  })
})
