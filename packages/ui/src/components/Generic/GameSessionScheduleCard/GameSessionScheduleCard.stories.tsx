import { gameSessionScheduleMock } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import { GameSessionScheduleCard } from "./GameSessionScheduleCard"

type Story = StoryObj<typeof GameSessionScheduleCard>

const meta: Meta<typeof GameSessionScheduleCard> = {
  component: GameSessionScheduleCard,
  title: "Generic Components/GameSessionScheduleCard",
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

export const Default: Story = {
  args: {
    gameSessionSchedule: gameSessionScheduleMock,
  },
}
