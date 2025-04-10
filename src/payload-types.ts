/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    admins: AdminAuthOperations;
  };
  blocks: {};
  collections: {
    admins: Admin;
    user: User;
    media: Media;
    semester: Semester;
    gameSessionSchedule: GameSessionSchedule;
    gameSession: GameSession;
    booking: Booking;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    admins: AdminsSelect<false> | AdminsSelect<true>;
    user: UserSelect<false> | UserSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    semester: SemesterSelect<false> | SemesterSelect<true>;
    gameSessionSchedule: GameSessionScheduleSelect<false> | GameSessionScheduleSelect<true>;
    gameSession: GameSessionSelect<false> | GameSessionSelect<true>;
    booking: BookingSelect<false> | BookingSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: Admin & {
    collection: 'admins';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface AdminAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admins".
 */
export interface Admin {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "user".
 */
export interface User {
  id: string;
  /**
   * The first name of the user
   */
  firstName: string;
  /**
   * The last name of the user
   */
  lastName: string;
  /**
   * The role of the user
   */
  role: 'member' | 'casual';
  /**
   * The number of remaining sessions the user has
   */
  remainingSessions?: number | null;
  /**
   * The image of the user
   */
  image?: (string | null) | Media;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "semester".
 */
export interface Semester {
  id: string;
  /**
   * The name of the semester
   */
  name: string;
  /**
   * The start date of the semester
   */
  startDate: string;
  /**
   * The end date of the semester
   */
  endDate: string;
  /**
   * The start date of the break
   */
  breakStart: string;
  /**
   * The end date of the break
   */
  breakEnd: string;
  /**
   * The day when booking opens for this semester
   */
  bookingOpenDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  /**
   * The time when booking opens for this semester
   */
  bookingOpenTime: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "gameSessionSchedule".
 */
export interface GameSessionSchedule {
  id: string;
  /**
   * The semester this game session schedule belongs to
   */
  semester: string | Semester;
  /**
   * The start time of the game session
   */
  startTime: string;
  /**
   * The end time of the game session
   */
  endTime: string;
  /**
   * The number of players that can join this game session
   */
  capacity: number;
  /**
   * The number of casual players that can join this game session
   */
  casualCapacity: number;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "gameSession".
 */
export interface GameSession {
  id: string;
  /**
   * The game session schedule for this game session. This is optional in case there is an extra schedule that doesn't require a schedule.
   */
  gameSessionSchedule?: (string | null) | GameSessionSchedule;
  /**
   * The semester this game session belongs to. This is required because a game session can't exist without a semester.
   */
  semester: string | Semester;
  /**
   * The start time of the game session
   */
  startTime: string;
  /**
   * The end time of the game session
   */
  endTime: string;
  /**
   * The number of players that can join this game session
   */
  capacity: number;
  /**
   * The number of casual players that can join this game session
   */
  casualCapacity: number;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "booking".
 */
export interface Booking {
  id: string;
  /**
   * The user who made the booking
   */
  user: string | User;
  /**
   * The game session that was booked
   */
  gameSession: string | GameSession;
  /**
   * The skill level of the player
   */
  playerLevel: 'beginner' | 'intermediate' | 'advanced';
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'admins';
        value: string | Admin;
      } | null)
    | ({
        relationTo: 'user';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'semester';
        value: string | Semester;
      } | null)
    | ({
        relationTo: 'gameSessionSchedule';
        value: string | GameSessionSchedule;
      } | null)
    | ({
        relationTo: 'gameSession';
        value: string | GameSession;
      } | null)
    | ({
        relationTo: 'booking';
        value: string | Booking;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'admins';
    value: string | Admin;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'admins';
    value: string | Admin;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admins_select".
 */
export interface AdminsSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "user_select".
 */
export interface UserSelect<T extends boolean = true> {
  firstName?: T;
  lastName?: T;
  role?: T;
  remainingSessions?: T;
  image?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "semester_select".
 */
export interface SemesterSelect<T extends boolean = true> {
  name?: T;
  startDate?: T;
  endDate?: T;
  breakStart?: T;
  breakEnd?: T;
  bookingOpenDay?: T;
  bookingOpenTime?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "gameSessionSchedule_select".
 */
export interface GameSessionScheduleSelect<T extends boolean = true> {
  semester?: T;
  startTime?: T;
  endTime?: T;
  capacity?: T;
  casualCapacity?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "gameSession_select".
 */
export interface GameSessionSelect<T extends boolean = true> {
  gameSessionSchedule?: T;
  semester?: T;
  startTime?: T;
  endTime?: T;
  capacity?: T;
  casualCapacity?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "booking_select".
 */
export interface BookingSelect<T extends boolean = true> {
  user?: T;
  gameSession?: T;
  playerLevel?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}