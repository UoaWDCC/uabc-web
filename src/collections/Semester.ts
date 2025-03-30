import type { CollectionConfig } from 'payload'

export enum Weekday {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

export const Semester: CollectionConfig = {
  slug: 'semester',
  access: {},
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the semester',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'The start date of the semester',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        description: 'The end date of the semester',
      },
    },
    {
      name: 'breakStart',
      type: 'date',
      required: true,
      admin: {
        description: 'The start date of the break',
      },
    },
    {
      name: 'breakEnd',
      type: 'date',
      required: true,
      admin: {
        description: 'The end date of the break',
      },
    },
    {
      name: 'bookingOpenDay',
      type: 'select',
      required: true,
      options: Object.values(Weekday),
      admin: {
        description: 'The day when booking opens for this semester',
      },
    },
    // Tech debt: This should be a time field
    {
      name: 'bookingOpenTime',
      type: 'text',
      required: true,
      admin: {
        description: 'The time when booking opens for this semester',
      },
    },
  ],
}
