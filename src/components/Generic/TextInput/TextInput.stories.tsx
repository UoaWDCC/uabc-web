import type { Meta, StoryFn } from '@storybook/react'
import { TextInput } from './TextInput'
import { PropsTable } from '.storybook/components'

type Story = StoryFn<typeof TextInput>

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'Components / TextInput',
}

export default meta

export const Basic: Story = () => {
  return <TextInput label="Label" type="text" />
}

export const Types: Story = () => {
  return (
    <PropsTable rows={['text', 'password', 'email', 'number']} variant="column">
      {(_, row, key) => (
        <TextInput
          key={key}
          label={`${row.charAt(0).toUpperCase()}${row.slice(1)} Input`}
          type={row}
        />
      )}
    </PropsTable>
  )
}

export const States: Story = () => {
  return (
    <PropsTable rows={['default', 'disabled', 'error']} variant="column">
      {(_, row, key) => {
        const props = {
          ...(row === 'disabled' && { disabled: true }),
          ...(row === 'error' && { isError: true, errorMessage: 'Error message' }),
        }

        return (
          <TextInput
            key={key}
            label="Input Label"
            type="text"
            placeholder="Placeholder text"
            {...props}
          />
        )
      }}
    </PropsTable>
  )
}
