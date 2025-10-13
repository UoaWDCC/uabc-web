import { z } from "zod"

/**
 * Schema for contact form data validation
 */
export const ContactFormDataSchema = z.object({
  /**
   * The user's first name
   * @example John
   */
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),

  /**
   * The user's last name
   * @example Doe
   */
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),

  /**
   * The user's university email address
   * @example john.doe@aucklanduni.ac.nz
   */
  universityEmail: z.string().email("Please enter a valid email address"),

  /**
   * The user's message or inquiry
   * @example I would like to know more about membership options
   */
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
})

/**
 * Schema for contact information validation
 */
export const ContactInfoSchema = z.object({
  /**
   * General inquiries email
   * @example badminton.au@gmail.com
   */
  generalEmail: z.string().email("Please enter a valid email address"),

  /**
   * Bookings email
   * @example bookings@badminton.au
   */
  bookingsEmail: z.string().email("Please enter a valid email address"),

  /**
   * Phone number
   * @example +64 9 123 4567
   */
  phoneNumber: z.string().min(1, "Phone number is required"),

  /**
   * Description for bookings section
   * @example Guest bookings, date changes, any clarification about your stay at the lodge
   */
  bookingsDescription: z.string().min(1, "Bookings description is required"),
})
