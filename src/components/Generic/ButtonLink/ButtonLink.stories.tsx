import type { Meta, StoryFn } from '@storybook/react'
import { SEMANTIC_COLOR_SCHEMES } from '../../../theme/semantics'
import { ButtonLink } from './ButtonLink'
import { PropsTable } from '.storybook/components'

type Story = StoryFn<typeof ButtonLink>

const meta: Meta<typeof ButtonLink> = {
  component: ButtonLink,
  title: 'Components / ButtonLink',
}

export default meta

export const Basic: Story = () => {
  return <ButtonLink href="#">Button</ButtonLink>
}

export const Variant: Story = () => {
  return (
    <PropsTable
      columns={['solid', 'subtle', 'surface', 'outline', 'ghost']}
      rows={SEMANTIC_COLOR_SCHEMES}
    >
      {(column, row, key) => {
        return (
          <ButtonLink key={key} colorScheme={row} variant={column} href="#">
            Button
          </ButtonLink>
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
          <ButtonLink key={key} colorScheme={row} variant={column} disabled href="#">
            Button
          </ButtonLink>
        )
      }}
    </PropsTable>
  )
}
