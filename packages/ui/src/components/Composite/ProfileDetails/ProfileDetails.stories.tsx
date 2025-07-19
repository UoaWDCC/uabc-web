import { defaultFields, defaultValues, ProfileDetails } from "./ProfileDetails"

export default {
  component: ProfileDetails,
  title: "Composite Components / ProfileDetails",
}

export const Default = () => (
  <ProfileDetails defaultValues={defaultValues} fields={defaultFields} title="Profile Details" />
)
