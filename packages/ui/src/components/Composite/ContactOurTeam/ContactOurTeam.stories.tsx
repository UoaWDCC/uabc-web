import type { ContactFormData, ContactInfo } from "@repo/shared"
import { MOCK_SOCIAL_LINKS } from "@repo/ui/components/Composite/Footer/constants"
import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import { ContactOurTeam } from "./ContactOurTeam"

const mockContactInfo: ContactInfo = {
  generalEmail: "badminton.au@gmail.com",
  bookingsEmail: "bookings@badminton.au",
  phoneNumber: "+64 9 123 4567",
  bookingsDescription:
    "Guest bookings, date changes, any clarification about your stay at the lodge",
}

const mockContactInfoWithLongDescription: ContactInfo = {
  generalEmail: "info@badminton.au",
  bookingsEmail: "bookings@badminton.au",
  phoneNumber: "+64 9 123 4567",
  bookingsDescription:
    "For all your booking needs including court reservations, event planning, group sessions, and any questions about our facilities and services. We're here to help you make the most of your badminton experience with us.",
}

const meta: Meta<typeof ContactOurTeam> = {
  title: "Composite Components / ContactOurTeam",
  component: ContactOurTeam,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    onSubmit: {
      description: "Function called when the contact form is submitted",
      table: {
        type: { summary: "(data: ContactFormData) => Promise<void>" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Whether the form is in a loading state",
      table: {
        type: { summary: "boolean" },
      },
    },
    socialLinks: {
      control: "object",
      description: "Array of social media links to display",
      table: {
        type: { summary: "SocialLink[]" },
      },
    },
    contactInfo: {
      control: "object",
      description: "Contact information for different categories",
      table: {
        type: { summary: "ContactInfo" },
      },
    },
  },
  args: {
    onSubmit: fn(),
    socialLinks: MOCK_SOCIAL_LINKS,
    contactInfo: mockContactInfo,
  },
}

export default meta
type Story = StoryObj<typeof ContactOurTeam>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const LongDescription: Story = {
  args: {
    contactInfo: mockContactInfoWithLongDescription,
  },
}

export const MinimalSocialLinks: Story = {
  args: {
    socialLinks: [MOCK_SOCIAL_LINKS[0]], // Only LinkTree
  },
}

export const NoSocialLinks: Story = {
  args: {
    socialLinks: [],
  },
}

export const CustomContactInfo: Story = {
  args: {
    contactInfo: {
      generalEmail: "support@example.com",
      bookingsEmail: "reservations@example.com",
      phoneNumber: "+1 555 123 4567",
      bookingsDescription: "Custom description for booking inquiries and reservations.",
    },
  },
}

const formSubmissionFn = fn()

export const FormSubmission: Story = {
  args: {
    onSubmit: async (data: ContactFormData) => {
      formSubmissionFn(data)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
    },
  },
}
