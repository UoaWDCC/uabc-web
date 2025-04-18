import { PropsTable } from '.storybook/components'
import type { Meta, StoryFn } from '@storybook/react'
import { SEMANTIC_COLOR_SCHEMES } from '../../../theme/semantics'
import { Button } from './Button'

type Story = StoryFn<typeof Button>

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components / Button',
}

export default meta

export const Basic: Story = () => {
  return <Button>Button</Button>
}

export const Variant: Story = () => {
  return (
    <PropsTable
      columns={['solid', 'subtle', 'surface', 'outline', 'ghost']}
      rows={SEMANTIC_COLOR_SCHEMES}
    >
      {(column, row, key) => {
        return (
          <Button key={key} colorScheme={row} variant={column}>
            Button
          </Button>
        )
      }}
    </PropsTable>
  )
}

export const Disabled: Story = () => {
  return (
    <PropsTable
      columns={['solid', 'subtle', 'surface', 'outline', 'ghost']}
      rows={SEMANTIC_COLOR_SCHEMES}
    >
      {(column, row, key) => {
        return (
          <Button key={key} colorScheme={row} variant={column} disabled>
            Button
          </Button>
        )
      }}
    </PropsTable>
  )
}
