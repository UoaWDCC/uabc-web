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
  render: (args) => {
    const dateSchema = z.date()

    const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0))

    return (
      <>
        <CalendarSelectPopup.Root
          {...args}
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
          {...args}
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
          {...args}
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
  args: {},
}
