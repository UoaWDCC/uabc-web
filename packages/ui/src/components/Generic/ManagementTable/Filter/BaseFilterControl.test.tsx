import { render, screen } from "@testing-library/react"
import { BaseFilterControl } from "./BaseFilterControl"

describe("<BaseFilterControl />", () => {
  it("renders children callback with correct props", () => {
    const value = "test-value"
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(
      <BaseFilterControl
        filterKey={"key" as never}
        onChange={onChange}
        onClear={onClear}
        value={value}
      >
        {({ value: childValue, onChange: childOnChange, onClear: childOnClear }) => {
          expect(childValue).toBe(value)
          expect(childOnChange).toBe(onChange)
          expect(childOnClear).toBe(onClear)
          return <div data-testid="child">child</div>
        }}
      </BaseFilterControl>,
    )
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })
})
