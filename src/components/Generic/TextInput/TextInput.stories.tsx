import type { Meta, StoryFn } from '@storybook/react'
import { TextInput } from './TextInput'
import { PropsTable } from '.storybook/components'

type Story = StoryFn<typeof TextInput>

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'Components / TextInput',
  argTypes: {
    label: {
      control: 'text',
      description: 'The label of the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      description: 'The type of the input',
      table: {
        type: { summary: '"text" | "password" | "email" | "number" | "search" | "tel" | "url"' },
        defaultValue: { summary: '"text"' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isError: {
      control: 'boolean',
      description: 'Whether the input is an error',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'The error message of the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    placeholderShownLabelCSS: {
      control: 'object',
      description: 'The CSS styles for the label when the placeholder is shown',
      table: {
        type: { summary: 'CSSUIObject' },
        defaultValue: { summary: '{}' },
      },
    },
    placeholderHiddenLabelCSS: {
      control: 'object',
      description: 'The CSS styles for the label when the placeholder is hidden',
      table: {
        type: { summary: 'CSSUIObject' },
        defaultValue: { summary: '{}' },
      },
    },
    focusedLabelCSS: {
      control: 'object',
      description: 'The CSS styles for the label when the input is focused',
      table: {
        type: { summary: 'CSSUIObject' },
        defaultValue: { summary: '{}' },
      },
    },
    activeLabelCSS: {
      control: 'object',
      description: 'The CSS styles for the label when the input is active',
      table: {
        type: { summary: 'CSSUIObject' },
        defaultValue: { summary: '{}' },
      },
    },
    labelProps: {
      control: 'object',
      description: 'The props for the label',
      table: {
        type: { summary: 'LabelProps' },
        defaultValue: { summary: '{}' },
      },
    },
  },
}

export default meta

export const Basic: Story = ({ type, ...args }) => {
  return <TextInput label="Label" type={type || 'text'} {...args} />
}

export const Types: Story = ({ type, ...args }) => {
  return (
    <PropsTable rows={['text', 'password', 'email', 'number']} variant="column">
      {(_, row, key) => (
        <TextInput
          key={key}
          label={`${row.charAt(0).toUpperCase()}${row.slice(1)} Input`}
          type={type || row}
          {...args}
        />
      )}
    </PropsTable>
  )
}

export const States: Story = ({ type, ...args }) => {
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
            type={type || 'text'}
            placeholder="Placeholder text"
            {...props}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const CustomStyles: Story = ({ type, ...args }) => {
  return (
    <TextInput
      label="Label"
      type={type || 'text'}
      placeholderShownLabelCSS={{
        color: 'blue',
      }}
      placeholderHiddenLabelCSS={{
        color: 'green',
      }}
      focusedLabelCSS={{
        color: 'red',
      }}
      activeLabelCSS={{
        color: 'orange',
      }}
      labelProps={{
        className: 'font-bold',
      }}
      {...args}
    />
  )
}
