import { NotAuthorised } from "."

export default {
  component: NotAuthorised,
  title: "Generic Components / NotAuthorised",
}

export const Default = () => <NotAuthorised />

export const Custom = () => (
  <NotAuthorised
    description="You must be an admin to view this page."
    href="/dashboard"
    returnLabel="Go Back"
    title="Access Denied"
  />
)
