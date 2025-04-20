import type { Meta, StoryFn } from '@storybook/react'
import { FONT_SIZES, Heading } from './Heading'
import { PropsTable } from '.storybook/components'

type Story = StoryFn<typeof Heading>

const meta: Meta<typeof Heading> = {
  component: Heading,
  title: 'Components / Heading',
}

export default meta

const variants = Object.keys(FONT_SIZES)

export const Basic: Story = () => {
  return <Heading>Heading</Heading>
}

export const Variant: Story = () => {
  return (
    <PropsTable rows={variants} variant="column">
      {(_, row, key) => {
        return (
          <Heading key={key} as={row}>
            Heading {row}
          </Heading>
        )
      }}
    </PropsTable>
  )
}
