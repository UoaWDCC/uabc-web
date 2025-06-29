import { Separator } from "@yamada-ui/react"
import type React from "react"

export const renderLineBreakNode = (key: string): React.ReactNode => {
  return <br key={key} />
}

export const renderHorizontalRuleNode = (key: string): React.ReactNode => {
  return <Separator key={key} />
}
