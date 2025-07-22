import type { CollectionConfig } from "payload"

export const Authentication: CollectionConfig = {
  slug: "authentication",
  admin: {
    useAsTitle: "email",
  },
  access: {},
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "user",
      required: true,
      admin: {
        description: "The user who owns this authentication",
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      admin: {
        description: "The user email that's related to this auth",
      },
    },
    {
      name: "password",
      type: "text",
      required: false,
      admin: {
        description: "The hashed password",
      },
    },
    {
      name: "provider",
      type: "select",
      options: [{ label: "Google", value: "google" }],
      required: false,
      admin: {
        description: "The type of authentication",
      },
    },
    {
      name: "providerAccountId",
      type: "text",
      required: false,
      admin: {
        description: "The provider account id of the user authentication",
      },
    },
    {
      name: "refreshToken",
      type: "text",
      required: false,
      admin: {
        description: "The refresh token of the user authentication",
      },
    },
    {
      name: "accessToken",
      type: "text",
      required: false,
      admin: {
        description: "The access token of the user authentication",
      },
    },
    {
      name: "expiresAt",
      type: "number",
      required: false,
      admin: {
        description: "The expiration time of the access token",
      },
    },
    {
      name: "tokenType",
      type: "text",
      required: false,
      admin: {
        description: "The type of token",
      },
    },
    {
      name: "scope",
      type: "text",
      required: false,
      admin: {
        description: "The scope of the token",
      },
    },
    {
      name: "idToken",
      type: "text",
      required: false,
      admin: {
        description: "The id token of the user authentication",
      },
    },
  ],
}
