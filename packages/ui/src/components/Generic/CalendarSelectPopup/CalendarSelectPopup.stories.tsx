import type { Meta, StoryObj } from "@storybook/react"
import { parseAsInteger, useQueryState } from "nuqs"
import { NuqsAdapter } from "nuqs/adapters/react"
import { z } from "zod"
import { Button } from "../../Primitive"
import { CalendarSelectPopup } from "."

type Story = StoryObj<typeof CalendarSelectPopup.Root>

const meta: Meta<typeof CalendarSelectPopup.Root> = {
  component: CalendarSelectPopup.Root,
  title: "Generic Components / CalendarSelectPopup",
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
}

export default meta

export const Default: Story = {
  render: (args) => (
    <CalendarSelectPopup.Root
      {...args}
      onClose={() => console.log("Calendar closed")}
      onDateSelect={(date) => console.log("Selected date:", date)}
      onOpen={() => console.log("Calendar opened")}
      showTrigger
    >
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Header
          subtitle="Customize your session booking"
          title="Additional Options"
        />
        <CalendarSelectPopup.Body>
          <Button colorScheme="secondary" disabled>
            Back
          </Button>
          <Button colorScheme="primary" disabled>
            Next
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  ),
  args: {
    title: "Select Date",
    popupId: "calendar",
    dateParamKey: "date",
  },
}

export const WithRangeDate: Story = {
  render: (args) => (
    <CalendarSelectPopup.Root
      {...args}
      calendarProps={{
        enableRange: true,
      }}
      onClose={() => console.log("Calendar closed")}
      onDateSelect={(date) => console.log("Selected date:", date)}
      onOpen={() => console.log("Calendar opened")}
      showTrigger
    >
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Header
          subtitle="Customize your session booking"
          title="Additional Options"
        />
        <CalendarSelectPopup.Body>
          <Button colorScheme="secondary" disabled>
            Back
          </Button>
          <Button colorScheme="primary" disabled>
            Next
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  ),
  args: {
    title: "Select Date",
    popupId: "calendar",
    dateParamKey: "date",
    initialDate: [undefined, undefined],
  },
}

export const WithNextNavigation: Story = {
  render: () => {
    const dateSchema = z.date()

    const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0))

    return (
      <>
        <CalendarSelectPopup.Root
          closeBehavior="close"
          currentStep={1}
          isOpen={step === 1}
          onDateSelect={() => {}}
          onStepChange={setStep}
          popupId="calendar-step-1"
          title="Step 1: Select Date"
          totalSteps={3}
        >
          <CalendarSelectPopup.Content>
            <CalendarSelectPopup.Header
              subtitle="Step 1: Choose a date to continue"
              title="Step 1 of 3"
            />
            <CalendarSelectPopup.Body>
              <CalendarSelectPopup.BackButton showOnFirstStep />
              <CalendarSelectPopup.NextButton schema={dateSchema} />
            </CalendarSelectPopup.Body>
          </CalendarSelectPopup.Content>
        </CalendarSelectPopup.Root>

        <CalendarSelectPopup.Root
          allowClose={true}
          calendarProps={{
            enableRange: true,
          }}
          closeBehavior="back"
          currentStep={2}
          isOpen={step === 2}
          onDateSelect={() => {}}
          onStepChange={setStep}
          popupId="calendar-step-2"
          title="Step 2: Select Another Date"
          totalSteps={3}
        >
          <CalendarSelectPopup.Content>
            <CalendarSelectPopup.Header
              subtitle="Step 2: Choose another date"
              title="Step 2 of 3"
            />
            <CalendarSelectPopup.Body>
              <CalendarSelectPopup.BackButton />
              <CalendarSelectPopup.NextButton schema={z.array(dateSchema)} />
            </CalendarSelectPopup.Body>
          </CalendarSelectPopup.Content>
        </CalendarSelectPopup.Root>

        <CalendarSelectPopup.Root
          allowClose={true}
          closeBehavior="close"
          currentStep={3}
          isOpen={step === 3}
          onDateSelect={() => {}}
          onStepChange={setStep}
          popupId="calendar-step-3"
          title="Step 3: Final Selection"
          totalSteps={3}
        >
          <CalendarSelectPopup.Content>
            <CalendarSelectPopup.Header
              subtitle="Step 3: Confirm your selection"
              title="Step 3 of 3"
            />
            <CalendarSelectPopup.Body>
              <CalendarSelectPopup.BackButton />
              <CalendarSelectPopup.NextButton
                onNext={() => {
                  alert("All steps complete!")
                  setStep(null)
                }}
                schema={dateSchema}
              />
            </CalendarSelectPopup.Body>
          </CalendarSelectPopup.Content>
        </CalendarSelectPopup.Root>

        {!step && (
          <Button colorScheme="primary" onClick={() => setStep(1)} size="lg">
            Start Multi-Step Calendar
          </Button>
        )}
      </>
    )
  },
}

export const MultipleIndependentPopups: Story = {
  render: () => (
    <>
      <CalendarSelectPopup.Root
        calendarProps={{ enableRange: false }}
        description="Choose the start date for the session."
        onDateSelect={(date) => console.log("Session Start Date:", date)}
        popupId="session-start"
        showTrigger
        title="Set Session Start Date"
      >
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header subtitle="Pick a session start date" title="Session Start" />
          <CalendarSelectPopup.Body>
            <Button colorScheme="primary">Confirm</Button>
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>

      <CalendarSelectPopup.Root
        calendarProps={{ enableRange: false }}
        description="Choose the start date for the semester."
        onDateSelect={(date) => console.log("Semester Start Date:", date)}
        popupId="semester-start"
        showTrigger
        title="Set Semester Start Date"
      >
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header
            subtitle="Pick a semester start date"
            title="Semester Start"
          />
          <CalendarSelectPopup.Body>
            <Button colorScheme="secondary">Confirm</Button>
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>
    </>
  ),
}

export const LimitSelectableDates: Story = {
  render: (args) => (
    <CalendarSelectPopup.Root
      {...args}
      calendarProps={{
        minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
        maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      }}
      onClose={() => console.log("Calendar closed")}
      onDateSelect={(date) => console.log("Selected date:", date)}
      onOpen={() => console.log("Calendar opened")}
      showTrigger
    >
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Header
          subtitle="Only dates between 5th and 20th are selectable."
          title="Limit Selectable Dates"
        />
        <CalendarSelectPopup.Body>
          <Button colorScheme="secondary" disabled>
            Back
          </Button>
          <Button colorScheme="primary" disabled>
            Next
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  ),
  args: {
    title: "Select Date (Limited)",
    popupId: "calendar-limited",
    dateParamKey: "date-limited",
  },
}

export const DisableSpecificDates: Story = {
  render: (args) => (
    <CalendarSelectPopup.Root
      {...args}
      calendarProps={{
        excludeDate: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
      }}
      onClose={() => console.log("Calendar closed")}
      onDateSelect={(date) => console.log("Selected date:", date)}
      onOpen={() => console.log("Calendar opened")}
      showTrigger
    >
      <CalendarSelectPopup.Content>
        <CalendarSelectPopup.Header
          subtitle="Weekends are disabled."
          title="Disable Specific Dates"
        />
        <CalendarSelectPopup.Body>
          <Button colorScheme="secondary" disabled>
            Back
          </Button>
          <Button colorScheme="primary" disabled>
            Next
          </Button>
        </CalendarSelectPopup.Body>
      </CalendarSelectPopup.Content>
    </CalendarSelectPopup.Root>
  ),
  args: {
    title: "Select Date (No Weekends)",
    popupId: "calendar-disable-dates",
    dateParamKey: "date-disable-dates",
  },
}
