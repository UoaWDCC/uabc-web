import type { SessionItem } from "../types"

/**
 * Shared mock session data for consistent testing and development
 *
 * This data is used across multiple components to ensure consistency
 * and avoid duplication of mock data.
 */
export const mockSessions: SessionItem[] = [
  {
    id: "lr66j8d0brq00d0jr460p9jx", // Tue | 7:30pm - 10:00pm | UoA Recreation Centre
    name: "UoA Recreation Centre",
    location: "UoA Recreation Centre",
    startTime: "19:30",
    endTime: "22:00",
    capacity: 35,
    casualCapacity: 5,
    attendees: 20,
    casualAttendees: 2,
    date: "2025-01-07", // Tuesday
  },
  {
    // cspell:disable-next-line
    id: "prfym4c0sz7dcj4v8gmkvg2u", // Wed | 5:00pm - 7:00pm | ABA
    name: "ABA",
    location: "ABA Location",
    startTime: "17:00",
    endTime: "19:00",
    capacity: 35,
    casualCapacity: 5,
    attendees: 25,
    casualAttendees: 3,
    date: "2025-01-08", // Wednesday
  },
  {
    // cspell:disable-next-line
    id: "34fds8276v9pqgv2w6zpmy4a", // Thu | 7:30pm - 10:00pm | King's School
    name: "King's School",
    location: "King's School Location",
    startTime: "19:30",
    endTime: "22:00",
    capacity: 30,
    casualCapacity: 5,
    attendees: 18,
    casualAttendees: 2,
    date: "2025-01-09", // Thursday
  },
  {
    // cspell:disable-next-line
    id: "smpt3sa8hgwn19osvdf3l3wa", // Fri | 7:30pm - 10:00pm | UoA Recreation Centre
    name: "UoA Recreation Centre",
    location: "UoA Recreation Centre",
    startTime: "19:30",
    endTime: "22:00",
    capacity: 35,
    casualCapacity: 5,
    attendees: 30,
    casualAttendees: 4,
    date: "2025-01-10", // Friday
  },
  {
    // cspell:disable-next-line
    id: "o2akj1d225h1fecaydjxze1b", // Sat | 4:00pm - 6:00pm | ABA
    name: "ABA",
    location: "ABA Location",
    startTime: "16:00",
    endTime: "18:00",
    capacity: 25,
    casualCapacity: 3,
    attendees: 15,
    casualAttendees: 2,
    date: "2025-01-11", // Saturday
  },
]
