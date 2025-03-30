import type { CollectionConfig } from 'payload'

export enum Roles {
  member = 'member',
  admin = 'admin',
  casual = 'casual',
}

export const User: CollectionConfig = {
  slug: 'user',
  access: {},
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'The first name of the user',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'The last name of the user',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: Object.values(Roles),
      defaultValue: Roles.casual,
      admin: {
        description: 'The role of the user',
      },
    },
    {
      name: 'remainingSessions',
      type: 'number',
      required: false,
      admin: {
        description: 'The number of remaining sessions the user has',
      },
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'The image of the user',
      },
    },
  ],
}
