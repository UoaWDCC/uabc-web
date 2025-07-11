import {
  NAVIGATION_BAR_ADMIN_TEST_CONSTANTS,
  NAVIGATION_BAR_CASUAL_TEST_CONSTANTS,
  NAVIGATION_BAR_MEMBER_TEST_CONSTANTS,
} from "@repo/ui/test-config/mocks/NavigationBar.mock"
import type { Meta, StoryObj } from "@storybook/react"
import { NavigationBar } from "./NavigationBar"

type Story = StoryObj<typeof NavigationBar>

const meta: Meta<typeof NavigationBar> = {
  component: NavigationBar,
  title: "Composite Components / NavigationBar",
  argTypes: {
    navItems: {
      control: "object",
      description: "Array of navigation items with label and path",
      table: {
        type: { summary: "Array<{ label: string; path: string }>" },
      },
    },
    user: {
      control: "object",
      description: "User object containing user information",
      table: { type: { summary: "User | undefined" } },
    },
  },
  args: NAVIGATION_BAR_CASUAL_TEST_CONSTANTS,
}

export default meta

export const Desktop: Story = {
  args: { user: undefined },
}

export const DesktopSignedInAsCasual: Story = {
  args: NAVIGATION_BAR_CASUAL_TEST_CONSTANTS,
}

export const DesktopSignedInAsMember: Story = {
  args: NAVIGATION_BAR_MEMBER_TEST_CONSTANTS,
}

export const DesktopSignedInAsAdmin: Story = {
  args: NAVIGATION_BAR_ADMIN_TEST_CONSTANTS,
}
