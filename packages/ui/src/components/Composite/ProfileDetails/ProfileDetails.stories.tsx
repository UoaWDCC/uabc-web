import { casualUserMock } from "@repo/shared/mocks"
import { InputType } from "@repo/ui/components/Primitive"
import { ProfileDetails } from "./ProfileDetails"

export default {
  component: ProfileDetails,
  title: "Composite Components / ProfileDetails",
}

const exampleFields = [
  {
    key: "fullName",
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
    inputType: InputType.Text,
    required: true,
  },
  {
    key: "email",
    type: "text",
    label: "Email Address",
    placeholder: "Enter your email",
    inputType: InputType.Email,
    required: true,
  },
  {
    key: "phoneNumber",
    type: "text",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputType: InputType.Tel,
  },
] as const

const defaultValues = {
  fullName: `${casualUserMock.firstName} ${casualUserMock.lastName}`,
  email: casualUserMock.email,
  phoneNumber: casualUserMock.phoneNumber,
}

export const Default = () => (
  <ProfileDetails defaultValues={defaultValues} fields={exampleFields} title="Profile Details" />
)
