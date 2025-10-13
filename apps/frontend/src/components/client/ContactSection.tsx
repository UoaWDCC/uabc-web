"use client"

import type { ContactFormData } from "@repo/shared"
import { ContactOurTeam } from "@repo/ui/components/Composite"
import { LinkTreeIcon } from "@repo/ui/components/Icon"
import { FacebookIcon, InstagramIcon } from "@yamada-ui/lucide"
import { useCallback } from "react"
import { useContactMutation } from "@/services/contact/ContactMutation"

const socialLinks = [
  {
    label: "LinkTree",
    url: "https://linktr.ee/uabc",
    icon: LinkTreeIcon,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/uabc",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/uabc",
    icon: InstagramIcon,
  },
]

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
      isLoading={mutation.isPending}
      onSubmit={handleSubmit}
      socialLinks={socialLinks}
    />
  )
}
