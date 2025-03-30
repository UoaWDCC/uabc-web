import type { CollectionConfig } from 'payload'

enum Roles {
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
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: Object.values(Roles),
      defaultValue: Roles.casual,
    },
    {
      name: 'remainingSessions',
      type: 'number',
      required: false,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: false,
    },
  ],
}
