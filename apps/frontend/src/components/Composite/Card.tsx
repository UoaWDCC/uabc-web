import { cva } from "class-variance-authority"
import type { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "card"
}

const cardVariants = cva("rounded-sm px-6 py-4", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      card: "bg-card text-card-foreground border",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
})

export const Card = ({ className, variant, children }: PropsWithChildren<CardProps>) => (
  <div className={cn(cardVariants({ variant }), className)}>{children}</div>
)
