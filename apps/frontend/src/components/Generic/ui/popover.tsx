import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"

type PopoverContextType = {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}

export const PopoverContext = createContext<PopoverContextType>({} as PopoverContextType)

// * Wrapper that provide functions to popover items
export const Popover = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <PopoverContext.Provider value={{ open, handleOpen, handleClose }}>
      {children}
    </PopoverContext.Provider>
  )
}

// * Menubar that renders on opening the popover
const PopoverMenubar = ({ children }: { children: ReactNode }) => {
  const { open, handleClose } = useContext(PopoverContext)

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose()
  }

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  })

  return (
    <>
      <div
        className={cn("fixed top-0 left-0 z-40 h-dvh w-dvw", open ? "block" : "hidden")}
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClose()
          }
        }}
        role="button"
        tabIndex={open ? 0 : undefined}
      />
      <div
        className={cn(
          "absolute top-4 right-6 z-50 flex w-56 flex-col rounded-md bg-background p-1 shadow-lg ring-1 ring-secondary",
          open ? "block" : "hidden",
        )}
      >
        {children}
      </div>
    </>
  )
}

// * Popover Trigger button
const PopoverOpenButton = ({ ...props }: ButtonProps) => {
  const { handleOpen } = useContext(PopoverContext)
  return (
    <Button onClick={handleOpen} {...props}>
      {props.children}
    </Button>
  )
}

Popover.Trigger = PopoverOpenButton
Popover.Menubar = PopoverMenubar
