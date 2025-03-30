import { CollectionConfig } from 'payload'

export const GameSession: CollectionConfig = {
  slug: 'gameSession',
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
      name: 'gameSessionScheduleId',
      type: 'relationship',
      relationTo: 'gameSessionSchedule',
      required: true,
      admin: {
        description: 'The game session schedule for this game session',
      },
    },
  ],
}
