import type { z } from "zod"
import type { ContactFormDataSchema, ContactInfoSchema } from "../schemas/contact"

/**
 * Type for contact form data
 */
export type ContactFormData = z.infer<typeof ContactFormDataSchema>

/**
 * Type for contact information
 */
export type ContactInfo = z.infer<typeof ContactInfoSchema>
