import type { CollectionConfig } from "payload"

export const Admin: CollectionConfig = {
  slug: "Admin",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
