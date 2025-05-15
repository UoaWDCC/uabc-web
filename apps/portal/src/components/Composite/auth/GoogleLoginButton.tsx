"use client"

import { Button } from "@yamada-ui/react"
import Image from "next/image"

import GoogleIcon from "../../../public/images/googleIcon.svg"

export const GoogleLoginButton = () => {
  return (
    <Button
      colorScheme="neutral"
      onClick={() => {
        throw new Error("NOT IMPLEMENTED")
      }}
      startIcon={<Image alt="Google Icon" height={20} src={GoogleIcon} width={20} />}
      variant="outline"
    >
      Continue with Google
    </Button>
  )
}
