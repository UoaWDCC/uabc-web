import { casualUserMock } from "@repo/shared/mocks"
import { defaultFields, ProfileDetails } from "./ProfileDetails"

export default {
  component: ProfileDetails,
  title: "Composite Components / ProfileDetails",
}

const defaultValues = {
  firstName: casualUserMock.firstName,
  lastName: casualUserMock.lastName,
  email: casualUserMock.email,
  phoneNumber: casualUserMock.phoneNumber,
}

export const Default = () => (
  <ProfileDetails defaultValues={defaultValues} fields={defaultFields} title="Profile Details" />
)
