# CalendarSelectPopup

A highly reusable calendar selection dialog component with search parameter state management and navigation utilities.

## Features

- **Multi-instance support**: Use multiple calendar popups with unique identifiers
- **Search parameter persistence**: Dialog state and selected dates persist in URL
- **Navigation utilities**: Built-in popup-to-popup navigation for complex flows
- **Range selection**: Support for both single date and date range selection
- **Composite component friendly**: Easy to wrap in custom components

## Basic Usage

### Single Calendar Popup

```tsx
import { CalendarSelectPopup } from "@/components/Generic/CalendarSelectPopup"

function MyComponent() {
  return (
    <CalendarSelectPopup
      popupId="booking-date"
      title="Select Booking Date"
      onDateSelect={(date) => console.log("Selected:", date)}
    />
  )
}
```

### Multiple Calendar Popups

```tsx
import { CalendarSelectPopup } from "@/components/Generic/CalendarSelectPopup"

function BookingFlow() {
  return (
    <>
      <CalendarSelectPopup
        popupId="check-in-date"
        title="Check-in Date"
        onDateSelect={(date) => console.log("Check-in:", date)}
      />
      
      <CalendarSelectPopup
        popupId="check-out-date"
        title="Check-out Date"
        onDateSelect={(date) => console.log("Check-out:", date)}
      />
    </>
  )
}
```

## Step-Based Navigation (Recommended)

For multi-step flows, use the `isOpen` prop with a step state for easier maintenance:

```tsx
import { useQueryState, parseAsInteger } from "nuqs"
import { CalendarSelectPopup, NextButton } from "@/components/Generic/CalendarSelectPopup"

function StepBasedFlow() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1))

  return (
    <>
      <CalendarSelectPopup.Root
        isOpen={step === 1}
        onClose={() => setStep(null)}
        popupId="step-1"
        title="Step 1: Select Date"
      >
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header title="Choose Date" />
          <CalendarSelectPopup.Body>
            <NextButton
              onNext={() => setStep(2)}
              schema={z.date()}
            />
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>

      <CalendarSelectPopup.Root
        isOpen={step === 2}
        onClose={() => setStep(null)}
        popupId="step-2"
        title="Step 2: Select Time"
      >
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header title="Choose Time" />
          <CalendarSelectPopup.Body>
            <Button onClick={() => setStep(1)}>Back</Button>
            <NextButton
              onNext={() => {
                alert("Complete!")
                setStep(null)
              }}
              schema={z.date()}
            />
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>
    </>
  )
}
```

## Navigation Between Popups

### Using the Hook Directly

```tsx
import { useCalendarSelectPopup } from "@/components/Generic/CalendarSelectPopup"

function NavigationExample() {
  const dateCalendar = useCalendarSelectPopup({
    popupId: "event-date",
    onDateSelect: (date) => {
      // Navigate to time picker after date selection
      dateCalendar.navigation.switchPopup("event-date", "event-time")
    }
  })

  const timeCalendar = useCalendarSelectPopup({
    popupId: "event-time",
    onDateSelect: (time) => {
      // Navigate to confirmation
      timeCalendar.navigation.switchPopup("event-time", "confirmation")
    }
  })

  return (
    <>
      <CalendarSelectPopup.Root {...dateCalendar} title="Select Date">
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header title="Choose Event Date" />
          <CalendarSelectPopup.Body>
            <Button onClick={() => dateCalendar.navigation.openPopup("event-time")}>
              Next: Select Time
            </Button>
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>

      <CalendarSelectPopup.Root {...timeCalendar} title="Select Time">
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header title="Choose Event Time" />
          <CalendarSelectPopup.Body>
            <Button onClick={() => timeCalendar.navigation.switchPopup("event-time", "event-date")}>
              Back to Date
            </Button>
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>
    </>
  )
}
```

### Using Navigation Patterns

```tsx
import { NavigationPatterns, useCalendarSelectPopup } from "@/components/Generic/CalendarSelectPopup"

function SequentialBookingFlow() {
  const calendar = useCalendarSelectPopup({
    popupId: "step-1",
    onDateSelect: (date) => {
      // Navigate to next step
      NavigationPatterns.sequential.next("step-1", "step-2", calendar.navigation)
    }
  })

  return (
    <CalendarSelectPopup.Root {...calendar}>
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Body>
          <Button onClick={() => 
            NavigationPatterns.sequential.next("step-1", "step-2", calendar.navigation)
          }>
            Next Step
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  )
}
```

## Composite Components

### Creating a Composite Component

```tsx
import { CalendarSelectPopup, createCompositeProps } from "@/components/Generic/CalendarSelectPopup"
import type { CompositeCalendarPopupProps } from "@/components/Generic/CalendarSelectPopup"

interface SelectDatePopupProps extends CompositeCalendarPopupProps {
  // Add your custom props here
  bookingType?: "single" | "recurring"
  maxDate?: Date
}

export function SelectDatePopup(props: SelectDatePopupProps) {
  const { bookingType = "single", maxDate, ...calendarProps } = props
  
  // Create default configuration with fallback ID
  const compositeProps = createCompositeProps("select-date-popup", calendarProps)
  
  return (
    <CalendarSelectPopup.Root
      {...compositeProps}
      onDateSelect={(date) => {
        console.log("Selected date:", date)
        // Add your custom logic here
        
        // Navigate to next step if needed
        if (bookingType === "recurring") {
          compositeProps.navigation?.switchPopup(
            compositeProps.popupId, 
            "recurring-options"
          )
        }
      }}
    >
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Header 
          title="Select Date"
          subtitle="Choose your preferred date"
        />
        <CalendarSelectPopup.Body>
          <Button colorScheme="primary">
            Continue
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  )
}
```

### Using in Your App

```tsx
import { SelectDatePopup } from "@/components/Composite/SelectDatePopup"

function BookingPage() {
  return (
    <div>
      <h1>Book Your Session</h1>
      <SelectDatePopup 
        popupId="booking-date"
        bookingType="single"
        maxDate={new Date("2024-12-31")}
      />
    </div>
  )
}
```

## Router Integration

### Opening Popup via Router

```tsx
import { useRouter } from "next/navigation"

function MyComponent() {
  const router = useRouter()
  
  const openDatePicker = () => {
    // This will automatically open the popup with popupId "booking-date"
    router.push("?booking-date=open")
  }
  
  return (
    <>
      <button onClick={openDatePicker}>Select Date</button>
      <CalendarSelectPopup popupId="booking-date" />
    </>
  )
}
```

### Multi-step Flow with Router

```tsx
import { useRouter } from "next/navigation"

function MultiStepBooking() {
  const router = useRouter()
  
  const handleDateSelect = (date: Date) => {
    // Navigate to time selection
    router.push("?booking-time=open")
  }
  
  const handleTimeSelect = (time: Date) => {
    // Navigate to confirmation
    router.push("?booking-confirm=open")
  }
  
  return (
    <>
      <CalendarSelectPopup 
        popupId="booking-date"
        onDateSelect={handleDateSelect}
      />
      
      <CalendarSelectPopup 
        popupId="booking-time"
        onDateSelect={handleTimeSelect}
      />
      
      <CalendarSelectPopup 
        popupId="booking-confirm"
        onDateSelect={() => console.log("Booking confirmed!")}
      />
    </>
  )
}
```

## Advanced Examples

### Conditional Navigation

```tsx
import { NavigationPatterns, useCalendarSelectPopup } from "@/components/Generic/CalendarSelectPopup"

function ConditionalFlow() {
  const calendar = useCalendarSelectPopup({
    popupId: "date-picker",
    onDateSelect: (date) => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      
      NavigationPatterns.conditional.navigate(
        "date-picker",
        isWeekend,
        "weekend-options",
        "weekday-options",
        calendar.navigation
      )
    }
  })

  return <CalendarSelectPopup.Root {...calendar} />
}
```

### Form Validation

```tsx
import { NavigationPatterns, useCalendarSelectPopup } from "@/components/Generic/CalendarSelectPopup"

function ValidatedFlow() {
  const calendar = useCalendarSelectPopup({
    popupId: "form-step-1",
  })

  const validateAndNext = () => {
    const isValid = () => {
      // Your validation logic
      return calendar.selectedDate !== null
    }

    NavigationPatterns.form.nextStep(
      "form-step-1",
      "form-step-2",
      isValid,
      calendar.navigation
    )
  }

  return (
    <CalendarSelectPopup.Root {...calendar}>
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Body>
          <Button onClick={validateAndNext}>
            Next Step
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  )
}
```

## API Reference

### CalendarSelectPopupProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `popupId` | `string` | **required** | Unique identifier for the popup |
| `isOpen` | `boolean` | - | Override internal open state (for external control) |
| `openValue` | `string` | `"open"` | Search param value for open state |
| `dateParamKey` | `string` | `"${popupId}-date"` | Search param key for date |
| `title` | `string` | `"Select Date"` | Dialog title |
| `description` | `string` | `"Select a date..."` | Dialog description |
| `onDateSelect` | `(date) => void` | - | Date selection callback |
| `onOpen` | `() => void` | - | Dialog open callback |
| `onClose` | `() => void` | - | Dialog close callback |
| `calendarProps` | `ExtendedCalendarProps` | `{}` | Calendar component props |
| `dialogProps` | `DialogProps` | `{}` | Dialog component props |

### Navigation Utilities

| Method | Description |
|--------|-------------|
| `navigation.openPopup(id)` | Open a specific popup |
| `navigation.closePopup(id)` | Close a specific popup |
| `navigation.switchPopup(from, to)` | Switch from one popup to another |

### Utility Functions

| Function | Description |
|----------|-------------|
| `createCompositeProps(id, props)` | Create props for composite components |
| `createPopupConfig(id, suffix?)` | Create popup configuration |
| `NavigationPatterns.*` | Pre-built navigation patterns | 