import { CollectionConfig } from 'payload'
import { createDateTimeField } from './fields/dateTime'

export const GameSession: CollectionConfig = {
  slug: 'gameSession',
  access: {},
  fields: [
    // Can have default values that inherits from the GameSessionSchedule collection
    createDateTimeField('bookingOpen', 'The time when booking opens for this game session'),
    createDateTimeField('bookingClose', 'The time when booking closes for this game session'),
    createDateTimeField('startTime', 'The start time of the game session'),
    createDateTimeField('endTime', 'The end time of the game session'),
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
