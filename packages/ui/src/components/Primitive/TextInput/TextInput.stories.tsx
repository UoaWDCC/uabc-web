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
import { VStack } from "@yamada-ui/react"
import { INPUT_TYPES, InputType, TextInput } from "./TextInput"

type Story = StoryFn<typeof TextInput>

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: "Primitive Components / TextInput",
  argTypes: {
    label: {
      control: "text",
      description: "The label text for the input field",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
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
    isError: {
      control: "boolean",
      description: "Whether the input is in an error state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: "text",
      description: "The error message displayed when the input is in an error state",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
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
  return <TextInput label="First name" type={type || InputType.Text} {...args} />
}

export const WithoutLabel: Story = ({ type, ...args }) => {
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
        label="Full Name"
        placeholder="Enter your full name"
        startIcon={<UserIcon />}
        type={InputType.Text}
        {...args}
      />
      <TextInput
        label="Email Address"
        placeholder="Enter your email"
        startIcon={<MailIcon />}
        type={InputType.Email}
        {...args}
      />
      <TextInput
        label="Search"
        placeholder="Search for anything..."
        startIcon={<SearchIcon />}
        type={InputType.Search}
        {...args}
      />
      <TextInput
        label="Phone Number"
        placeholder="Enter your phone number"
        startIcon={<PhoneIcon />}
        type={InputType.Tel}
        {...args}
      />
      <TextInput
        label="Address"
        placeholder="Enter your address"
        startIcon={<MapPinIcon />}
        type={InputType.Text}
        {...args}
      />
      <TextInput
        label="Credit Card"
        placeholder="Enter card number"
        startIcon={<CreditCardIcon />}
        type={InputType.Text}
        {...args}
      />
      <TextInput
        label="Amount"
        placeholder="Enter amount"
        startIcon={<DollarSignIcon />}
        type={InputType.Number}
        {...args}
      />
      <TextInput label="Date" startIcon={<CalendarIcon />} type={InputType.Date} {...args} />
    </VStack>
  )
}

export const WithEndIcon: Story = ({ type, ...args }) => {
  return (
    <VStack>
      <TextInput
        endIcon={<SearchIcon />}
        label="Search"
        placeholder="Search..."
        type={InputType.Search}
        {...args}
      />
      <TextInput endIcon={<CalendarIcon />} label="Date" type={InputType.Date} {...args} />
      <TextInput
        endIcon={<DollarSignIcon />}
        label="Amount"
        placeholder="Enter amount"
        type={InputType.Number}
        {...args}
      />
      <TextInput
        endIcon={<CreditCardIcon />}
        label="Credit Card"
        placeholder="Enter card number"
        type={InputType.Text}
        {...args}
      />
      <TextInput
        endIcon={<PhoneIcon />}
        label="Phone Number"
        placeholder="Enter your phone number"
        type={InputType.Tel}
        {...args}
      />
      <TextInput
        endIcon={<MapPinIcon />}
        label="Address"
        placeholder="Enter your address"
        type={InputType.Text}
        {...args}
      />
      <TextInput
        endIcon={<MailIcon />}
        label="Email Address"
        placeholder="Enter your email"
        type={InputType.Email}
        {...args}
      />
    </VStack>
  )
}

export const CustomStyling: Story = ({ type, ...args }) => {
  return (
    <TextInput
      _focus={{
        borderColor: "purple.500",
        boxShadow: "0 0 0 1px purple",
      }}
      borderRadius="lg"
      borderWidth="2px"
      fontSize="lg"
      formControlProps={{
        maxW: "300px",
      }}
      h="12"
      label="Custom Styled Input"
      placeholder="Custom styling example"
      type={type || InputType.Text}
      {...args}
    />
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
          <TextInput
            disabled={isDisabled}
            errorMessage={isError ? "This field has an error" : undefined}
            isError={isError}
            key={key}
            placeholder={`Enter ${row}`}
            type={row}
            {...args}
          />
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
            label={`${row} input`}
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
