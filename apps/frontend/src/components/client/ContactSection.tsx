"use client"

import type { ContactFormData } from "@repo/shared"
import { ContactOurTeam } from "@repo/ui/components/Composite"
import { LinkTreeIcon } from "@repo/ui/components/Icon"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import { useCallback } from "react"
import { useContactMutation } from "@/services/contact/ContactMutations"

const socialLinks = [
  {
    label: "LinkTree",
    url: "https://linktr.ee/uoa.badminton",
    icon: LinkTreeIcon,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/groups/uoabadminton",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/uoa.badminton",
    icon: InstagramIcon,
  },
]

const defaultContactInfo = {
  // TODO: Change before deploying to production
  generalEmail: "badminton.au@gmail.com",
  bookingsEmail: "badminton.au@gmail.com",
  phoneNumber: "000-000-000 (Will be updated soon)",
  bookingsDescription:
    "Guest bookings, date changes, any clarification about your stay at the lodge",
}

/**
 * Client-side contact section that handles form submission
 */
export const ContactSection = () => {
  const mutation = useContactMutation()

  const handleSubmit = useCallback(
    async (data: ContactFormData) => {
      await mutation.mutateAsync(data)
    },
    [mutation],
  )

  return (
    <ContactOurTeam
      contactInfo={defaultContactInfo}
      isLoading={mutation.isPending}
      onSubmit={handleSubmit}
      socialLinks={socialLinks}
    />
  )
}
