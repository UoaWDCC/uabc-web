import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { ReactNode } from "react"

export const NuqsProvider = ({ children }: { children: ReactNode }) => {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
