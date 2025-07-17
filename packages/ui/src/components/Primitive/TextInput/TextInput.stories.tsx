import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import {
  CalendarIcon,
  CreditCardIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "@yamada-ui/lucide"
import { FormControl } from "@yamada-ui/react"
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

const icons = [
  {
    icon: <UserIcon />,
    label: "Enter your full name",
  },
  {
    icon: <MailIcon />,
    label: "Enter your email",
  },
  {
    icon: <SearchIcon />,
    label: "Search for anything...",
  },
  {
    icon: <PhoneIcon />,
    label: "Enter your phone number",
  },
  {
    icon: "+64",
    label: "+64 21 123 4567",
  },
  {
    icon: <CreditCardIcon />,
    label: "Enter your card number",
  },
  {
    icon: <CalendarIcon />,
    label: "Enter date",
  },
]

export const WithStartElement: Story = ({ type, ...args }) => {
  return (
    <PropsTable
      rows={[
        InputType.Text,
        InputType.Email,
        InputType.Search,
        InputType.Tel,
        InputType.Number,
        InputType.Date,
      ]}
      variant="column"
    >
      {(_, row: InputType, _key: string, _colIndex: number, index: number) => {
        return (
          <TextInput
            key={index}
            placeholder={icons[index].label}
            startElement={icons[index].icon}
            type={row as InputType}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const WithEndElement: Story = ({ type, ...args }) => {
  return (
    <PropsTable
      rows={[
        InputType.Text,
        InputType.Email,
        InputType.Search,
        InputType.Tel,
        InputType.Number,
        InputType.Date,
      ]}
      variant="column"
    >
      {(_, row: InputType, _key: string, _colIndex: number, index: number) => {
        return (
          <TextInput
            endElement={icons[index].icon}
            key={index}
            placeholder={icons[index].label}
            type={row as InputType}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const WithStartAddon: Story = ({ type, ...args }) => {
  return (
    <PropsTable
      rows={[
        InputType.Text,
        InputType.Email,
        InputType.Search,
        InputType.Tel,
        InputType.Number,
        InputType.Date,
      ]}
      variant="column"
    >
      {(_, row: InputType, _key: string, _colIndex: number, index: number) => {
        return (
          <TextInput
            key={index}
            placeholder={icons[index].label}
            startAddon={icons[index].icon}
            type={row as InputType}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const WithEndAddon: Story = ({ type, ...args }) => {
  return (
    <PropsTable
      rows={[
        InputType.Text,
        InputType.Email,
        InputType.Search,
        InputType.Tel,
        InputType.Number,
        InputType.Date,
      ]}
      variant="column"
    >
      {(_, row: InputType, _key: string, _colIndex: number, index: number) => {
        return (
          <TextInput
            endAddon={icons[index].icon}
            key={index}
            placeholder={icons[index].label}
            type={row as InputType}
            {...args}
          />
        )
      }}
    </PropsTable>
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
            endElement={hasEndIcon ? getIcon(row) : undefined}
            key={key}
            placeholder={`Enter ${row}`}
            startElement={hasStartIcon ? getIcon(row) : undefined}
            type={row}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}
