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
    onClick={() => {
      throw new Error("Log Out Button Not Implemented")
    }}
    size={size}
    variant={variant}
  >
    {children}
  </Button>
)
