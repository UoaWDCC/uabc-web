"use client"

import type { PropsWithChildren } from "react"

import { Button, type ButtonProps } from "@repo/ui/components/Button"

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
