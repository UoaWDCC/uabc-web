import { CollectionConfig } from 'payload'

export const Authentication: CollectionConfig = {
  slug: 'authentication',
  access: {},
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'user',
      required: true,
      admin: {
        description: 'The user who owns this authentication',
      },
    },
    {
      name: 'type',
      type: 'text',
      required: true,
      admin: {
        description: 'The type of authentication',
      },
    },
    {
      name: 'provider',
      type: 'select',
      options: [{ label: 'Google', value: 'google' }],
      required: true,
      admin: {
        description: 'The type of authentication',
      },
    },
    {
      name: 'providerAccountId',
      type: 'text',
      required: false,
      admin: {
        description: 'The provider account id of the user authentication',
      },
    },
    {
      name: 'refreshToken',
      type: 'text',
      required: false,
      admin: {
        description: 'The refresh token of the user authentication',
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      required: true,
      admin: {
        description: 'The access token of the user authentication',
      },
    },
    {
      name: 'expiresAt',
      type: 'number',
      required: true,
      admin: {
        description: 'The expiration time of the access token',
      },
    },
    {
      name: 'tokenType',
      type: 'text',
      required: false,
      admin: {
        description: 'The type of token',
      },
    },
    {
      name: 'scope',
      type: 'text',
      required: false,
      admin: {
        description: 'The scope of the token',
      },
    },
    {
      name: 'idToken',
      type: 'text',
      required: false,
      admin: {
        description: 'The id token of the user authentication',
      },
    },
  ],
}
