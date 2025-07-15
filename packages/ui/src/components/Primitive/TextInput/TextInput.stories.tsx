import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "@yamada-ui/lucide"
import { FormControl, VStack } from "@yamada-ui/react"
import { TextInput } from "./TextInput"
import { INPUT_TYPES, InputType } from "./types"

type Story = StoryFn<typeof TextInput>

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: "Primitive Components / TextInput",
  argTypes: {
    type: {
      control: "select",
      options: INPUT_TYPES,
      description: "The type of the input field",
      table: {
        type: { summary: `"${INPUT_TYPES.join('" | "')}"` },
        defaultValue: { summary: `"${InputType.Text}"` },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
}

export default meta

export const Basic: Story = ({ type, ...args }) => {
  return <TextInput type={type || InputType.Text} {...args} />
}

export const WithPlaceholder: Story = ({ type, ...args }) => {
  return (
    <>
      <TextInput placeholder="No label" type={type || InputType.Text} {...args} />
      <TextInput placeholder="Email without label" type={InputType.Email} {...args} />
      <TextInput placeholder="Password without label" type={InputType.Password} {...args} />
    </>
  )
}

export const WithStartIcon: Story = ({ type, ...args }) => {
  return (
    <VStack>
      <TextInput
        placeholder="Enter your full name"
        startIcon={<UserIcon />}
        type={InputType.Text}
        {...args}
      />
      <TextInput
        placeholder="Enter your email"
        startIcon={<MailIcon />}
        type={InputType.Email}
        {...args}
      />
      <TextInput
        placeholder="Search for anything..."
        startIcon={<SearchIcon />}
        type={InputType.Search}
        {...args}
      />
      <TextInput
        placeholder="Enter your phone number"
        startIcon={<PhoneIcon />}
        type={InputType.Tel}
        {...args}
      />
      <TextInput
        placeholder="Enter your address"
        startIcon={<MapPinIcon />}
        type={InputType.Text}
        {...args}
      />
      <TextInput
        placeholder="Enter card number"
        startIcon={<CreditCardIcon />}
        type={InputType.Text}
        {...args}
      />
      <TextInput
        placeholder="Enter amount"
        startIcon={<DollarSignIcon />}
        type={InputType.Number}
        {...args}
      />
      <TextInput startIcon={<CalendarIcon />} type={InputType.Date} {...args} />
    </VStack>
  )
}

export const WithEndIcon: Story = ({ type, ...args }) => {
  return (
    <VStack>
      <TextInput
        endIcon={<SearchIcon />}
        placeholder="Search..."
        type={InputType.Search}
        {...args}
      />
      <TextInput endIcon={<CalendarIcon />} type={InputType.Date} {...args} />
      <TextInput
        endIcon={<DollarSignIcon />}
        placeholder="Enter amount"
        type={InputType.Number}
        {...args}
      />
      <TextInput
        endIcon={<CreditCardIcon />}
        placeholder="Enter card number"
        type={InputType.Text}
        {...args}
      />
      <TextInput
        endIcon={<PhoneIcon />}
        placeholder="Enter your phone number"
        type={InputType.Tel}
        {...args}
      />
      <TextInput
        endIcon={<MapPinIcon />}
        placeholder="Enter your address"
        type={InputType.Text}
        {...args}
      />
      <TextInput
        endIcon={<MailIcon />}
        placeholder="Enter your email"
        type={InputType.Email}
        {...args}
      />
    </VStack>
  )
}

export const TypesAndStates: Story = (args) => {
  const states = ["normal", "disabled", "error"]

  return (
    <PropsTable columns={states} rows={INPUT_TYPES}>
      {(column, row, key) => {
        const isDisabled = column === "disabled"
        const isError = column === "error"
        return (
          <FormControl
            disabled={isDisabled}
            errorMessage={isError ? "This is required." : undefined}
            helperMessage="This is a helper text"
            invalid={isError}
            key={key}
            label={row.charAt(0).toUpperCase() + row.slice(1)}
            replace
          >
            <TextInput placeholder="UABC" type={row} {...args} />
          </FormControl>
        )
      }}
    </PropsTable>
  )
}

export const IconVariations: Story = (args) => {
  const iconTypes = ["startIcon", "endIcon", "both", "none"]
  const commonInputTypes = [InputType.Text, InputType.Email, InputType.Search, InputType.Tel]

  return (
    <PropsTable columns={iconTypes} rows={commonInputTypes}>
      {(column, row, key) => {
        const hasStartIcon = column === "startIcon" || column === "both"
        const hasEndIcon = column === "endIcon" || column === "both"

        const getIcon = (type: InputType) => {
          switch (type) {
            case InputType.Email:
              return <MailIcon />
            case InputType.Search:
              return <SearchIcon />
            case InputType.Tel:
              return <PhoneIcon />
            default:
              return <UserIcon />
          }
        }

        return (
          <TextInput
            endIcon={hasEndIcon ? getIcon(row) : undefined}
            key={key}
            placeholder={`Enter ${row}`}
            startIcon={hasStartIcon ? getIcon(row) : undefined}
            type={row}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}
