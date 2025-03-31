import type { CollectionConfig } from 'payload'
import { createTimeField } from './fields/dateTime'

export const GameSessionSchedule: CollectionConfig = {
  slug: 'gameSessionSchedule',
  access: {},
  fields: [
    createTimeField('bookingOpen', 'The time when booking opens for this game session'),
    createTimeField('bookingClose', 'The time when booking closes for this game session'),
    createTimeField('startTime', 'The start time of the game session'),
    createTimeField('endTime', 'The end time of the game session'),
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
