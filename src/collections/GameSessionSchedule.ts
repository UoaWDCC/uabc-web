import type { CollectionConfig } from 'payload'

export const GameSessionSchedule: CollectionConfig = {
  slug: 'gameSessionSchedule',
  access: {},
  fields: [
    {
      name: 'bookingOpen',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
        },
        description: 'The time when booking opens for this game session',
      },
      hooks: {
        beforeChange: [
          (args) => {
            const date = new Date(args.value)
            const totalMiliseconds =
              date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000
            return totalMiliseconds
          },
        ],
      },
    },
    {
      name: 'bookingClose',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
        },
        description: 'The time when booking closes for this game session',
      },
      hooks: {
        beforeChange: [
          (args) => {
            const date = new Date(args.value)
            const totalMiliseconds =
              date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000
            return totalMiliseconds
          },
        ],
      },
    },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
        },
        description: 'The start time of the game session',
      },
      hooks: {
        beforeChange: [
          (args) => {
            const date = new Date(args.value)
            const totalMiliseconds =
              date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000
            return totalMiliseconds
          },
        ],
      },
    },
    {
      name: 'endTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
        },
        description: 'The end time of the game session',
      },
      hooks: {
        beforeChange: [
          (args) => {
            const date = new Date(args.value)
            const totalMiliseconds =
              date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000
            return totalMiliseconds
          },
        ],
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
