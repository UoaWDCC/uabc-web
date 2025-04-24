import type { DateField } from "payload"

/**
 * Creates a date field but only shows the time picker
 * @param name The name of the date time field
 * @param description The description of the date time field
 * @returns {Field} The date time field
 */
export function createTimeField(name: string, description: string): DateField {
  return {
    name: name,
    type: "date",
    required: true,
    admin: {
      date: {
        pickerAppearance: "timeOnly",
      },
      description: description,
    },
    hooks: {
      beforeChange: [
        (args) => {
          const date = new Date(args.value)
          // Ensure that the hours and minutes are retained by setting the date to 1970-01-01
          const fixedDate = new Date(1970, 0, 1, date.getHours(), date.getMinutes())
          return fixedDate
        },
      ],
    },
  }
}
