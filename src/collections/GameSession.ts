import { CollectionConfig } from 'payload'
import { createTimeField } from '@/common/fields/date-time'

export const GameSession: CollectionConfig = {
  slug: 'gameSession',
  access: {},
  fields: [
    // Can have default values that inherits from the GameSessionSchedule collection
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
