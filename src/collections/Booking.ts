import { CollectionConfig } from 'payload'

export enum PlayerLevel {
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

export const Booking: CollectionConfig = {
  slug: 'booking',
  access: {},
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'user',
      required: true,
      admin: {
        description: 'The user who made the booking',
      },
    },
    {
      name: 'gameSession',
      type: 'relationship',
      relationTo: 'gameSession',
      required: true,
      admin: {
        description: 'The game session that was booked',
      },
    },
    {
      name: 'playerLevel',
      type: 'select',
      options: Object.values(PlayerLevel),
      required: true,
      admin: {
        description: 'The skill level of the player',
      },
    },
  ],
}
