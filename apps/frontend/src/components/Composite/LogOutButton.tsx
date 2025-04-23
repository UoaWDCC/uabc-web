"use client"

import type { PropsWithChildren } from "react"

import type { ButtonProps } from "../Generic/ui/button"
import { Button } from "../Generic/ui/button"

export const LogOutButton = ({
  children,
  size = "icon",
  variant = "ghost",
}: PropsWithChildren<ButtonProps>) => (
  <Button
    size={size}
    variant={variant}
    onClick={() => {
      throw new Error("Log Out Button Not Implemented")
    }}
  >
    {children}
  </Button>
)
