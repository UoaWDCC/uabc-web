import { AdditionalInfo, defaultFields, defaultValues } from "./AdditionalInfo"

export default {
  component: AdditionalInfo,
  title: "Composite Components / AdditionalInfo",
}

export const Default = () => (
  <AdditionalInfo defaultValues={defaultValues} fields={defaultFields} title="Additional Info" />
)
