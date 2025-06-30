"use client"

import { Button, type ButtonProps } from "@repo/ui/components/Button"
import type { PropsWithChildren } from "react"

export const LogOutButton = ({ children, variant = "ghost" }: PropsWithChildren<ButtonProps>) => (
  <Button
    onClick={() => {
      throw new Error("Log Out Button Not Implemented")
    }}
    variant={variant}
  >
    {children}
  </Button>
)
