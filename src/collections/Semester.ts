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
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'breakStart',
      type: 'date',
      required: true,
    },
    {
      name: 'breakEnd',
      type: 'date',
      required: true,
    },
    {
      name: 'bookingOpenDay',
      type: 'select',
      required: true,
      options: Object.values(Weekday),
    },
    // Tech debt: This should be a time field
    {
      name: 'bookingOpenTime',
      type: 'text',
      required: true,
    },
  ],
}
