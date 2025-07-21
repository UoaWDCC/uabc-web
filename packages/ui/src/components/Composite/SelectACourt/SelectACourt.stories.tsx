import type { Meta, StoryObj } from "@storybook/react"
import { SelectACourt } from "./SelectACourt"

/**
 * Meta configuration for SelectACourt component stories.
 *
 * This component allows users to select booking sessions in a multi-step form flow.
 * It supports both member and casual user types with different selection limits.
 */
const meta: Meta<typeof SelectACourt> = {
  title: "Composite Components / SelectACourt",
  component: SelectACourt,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A session selection component for booking courts in a multi-step form flow.

## Features
- **Member/Casual variants**: Different selection limits (2 vs 1 sessions)
- **Real-time validation**: Enforces selection limits automatically
- **Form integration**: Uses React Hook Form for state management
- **Navigation support**: Back/Next buttons for multi-step flows
- **Responsive design**: Adapts to different screen sizes

## Usage
\`\`\`tsx
import { SelectACourt } from "@repo/ui/components/Composite"

<SelectACourt
  variant="member"
  sessions={availableSessions}
  onSelect={handleSelection}
  onNext={handleNextStep}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      description: "User type that determines selection behavior",
      control: { type: "select" },
      options: ["member", "casual"],
      table: {
        type: { summary: '"member" | "casual"' },
        defaultValue: { summary: '"member"' },
      },
    },
    sessions: {
      description: "Array of available booking sessions",
      control: { type: "object" },
      table: {
        type: { summary: "SessionItem[]" },
        defaultValue: { summary: "[]" },
      },
    },
    title: {
      description: "Title displayed in the component header",
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"Select a court"' },
      },
    },
    onSelect: {
      description: "Callback when sessions are selected/deselected",
      action: "sessions selected",
      table: {
        type: { summary: "(value: string | string[] | undefined) => void" },
      },
    },
    onBack: {
      description: "Callback when back button is clicked",
      action: "back clicked",
      table: {
        type: { summary: "() => void" },
      },
    },
    onNext: {
      description: "Callback when next button is clicked with form data",
      action: "next clicked",
      table: {
        type: { summary: "(data: any) => void" },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story showing member variant with multiple session options.
 *
 * Members can select up to 2 sessions and see attendee counts for both
 * member and casual users.
 */
export const Default: Story = {
  args: {
    variant: "member",
    title: "Select Your Sessions",
    sessions: [
      {
        label: "Monday, 12th May",
        memberAttendees: "32/35",
        casualAttendees: "4/5",
        value: "monday-session",
        addon: "ABA",
        description: "5:00 - 7:00 pm",
      },
      {
        label: "Wednesday, 14th May",
        memberAttendees: "28/35",
        casualAttendees: "2/5",
        value: "wednesday-session",
        addon: "UoA Rec",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Thursday, 15th May",
        memberAttendees: "25/30",
        casualAttendees: "3/5",
        value: "thursday-session",
        addon: "Kings School",
        description: "7:30 - 10:00 pm",
      },
      {
        label: "Friday, 16th May",
        memberAttendees: "30/35",
        casualAttendees: "1/5",
        value: "friday-session",
        addon: "UoA Rec Centre",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Saturday, 17th May",
        memberAttendees: "20/25",
        casualAttendees: "2/3",
        value: "saturday-session",
        addon: "ABA",
        description: "4:00 - 6:00 pm",
      },
    ],
    onSelect: (value) => console.log("Selected sessions:", value),
    onBack: () => console.log("Back button clicked"),
    onNext: (data) => console.log("Next button clicked with data:", data),
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the member variant where users can select up to 2 sessions.

**Key features:**
- Shows attendee counts for both member and casual users
- Allows multiple session selection (up to 2)
- Displays real-time session availability
- Integrates with form validation
        `,
      },
    },
  },
}

/**
 * Casual user story showing single session selection.
 *
 * Casual users can only select 1 session and don't see member attendee counts.
 */
export const Casual: Story = {
  args: {
    variant: "casual",
    title: "Choose Your Session",
    sessions: [
      {
        label: "Monday, 12th May",
        memberAttendees: "32/35",
        casualAttendees: "4/5",
        value: "monday-casual",
        addon: "ABA",
        description: "5:00 - 7:00 pm",
      },
      {
        label: "Wednesday, 14th May",
        memberAttendees: "28/35",
        casualAttendees: "2/5",
        value: "wednesday-casual",
        addon: "UoA Rec",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Thursday, 15th May",
        memberAttendees: "25/30",
        casualAttendees: "3/5",
        value: "thursday-casual",
        addon: "Kings School",
        description: "7:30 - 10:00 pm",
      },
      {
        label: "Friday, 16th May",
        memberAttendees: "30/35",
        casualAttendees: "1/5",
        value: "friday-casual",
        addon: "UoA Rec Centre",
        description: "7:30 - 9:30 pm",
      },
      {
        label: "Saturday, 17th May",
        memberAttendees: "20/25",
        casualAttendees: "2/3",
        value: "saturday-casual",
        addon: "ABA",
        description: "4:00 - 6:00 pm",
      },
    ],
    onSelect: (value) => console.log("Selected session:", value),
    onBack: () => console.log("Back button clicked"),
    onNext: (data) => console.log("Next button clicked with data:", data),
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the casual variant where users can select only 1 session.

**Key differences from member:**
- Single session selection only
- No member attendee counts displayed
- Simplified interface for casual users
- Different validation rules
        `,
      },
    },
  },
}
