import type { CollectionConfig } from 'payload'

export const GameSessionSchedule: CollectionConfig = {
  slug: 'gameSessionSchedule',
  access: {},
  fields: [
    {
      name: 'bookingOpen',
      type: 'text',
      required: true,
      admin: {
        description: 'The time when booking opens for this game session',
      },
    },
    {
      name: 'bookingClose',
      type: 'text',
      required: true,
      admin: {
        description: 'The time when booking closes for this game session',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: {
        description: 'The start time of the game session',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      admin: {
        description: 'The end time of the game session',
      },
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      admin: {
        description: 'The number of players that can join this game session',
      },
    },
    {
      name: 'casualCapacity',
      type: 'number',
      required: true,
      admin: {
        description: 'The number of casual players that can join this game session',
      },
    },
    {
      name: 'semesterId',
      type: 'relationship',
      relationTo: 'semester',
      required: true,
      admin: {
        description: 'The semester this game session schedule belongs to',
      },
    },
  ],
}
