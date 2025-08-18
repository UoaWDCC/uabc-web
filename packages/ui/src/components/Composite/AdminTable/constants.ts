import { MembershipType, PlayLevel, University } from "@repo/shared"
import type { ColumnConfig } from "../../Generic"
import type { FilterBarConfig } from "../../Generic/ManagementTable/Filter"
import type { UserData } from "./Columns"

export const COLUMNS_CONFIG: ColumnConfig<UserData>[] = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "level", label: "Play Level" },
  { key: "remaining", label: "Remaining" },
  { key: "university", label: "University" },
  { key: "joined", label: "Joined" },
]

export const FILTER_CONFIGS: readonly FilterBarConfig<UserData>[] = [
  {
    key: ["name", "email"],
    type: "text",
    placeholder: "Filter...",
  },
  {
    key: "role",
    type: "multiselect",
    items: [
      ...Object.values(MembershipType).map((role) => ({
        label: role,
        value: role,
      })),
    ],
    label: "All",
    onChange: () => {
      console.log("onChange")
    },
  },
  {
    key: "university",
    type: "multiselect",
    items: [
      ...Object.values(University).map((university) => ({
        label: university,
        value: university,
      })),
    ],
    label: "University",
    w: "md",
  },
  {
    key: "level",
    type: "multiselect",
    items: [
      ...Object.values(PlayLevel).map((level) => ({
        label: level,
        value: level,
      })),
    ],
    label: "Play Level",
    w: "md",
  },
]
