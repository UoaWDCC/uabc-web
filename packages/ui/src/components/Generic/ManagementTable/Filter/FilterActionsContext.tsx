import type { CreateUserRequest } from "@repo/shared/types"
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react"

const FilterActionsContext = createContext<FilterActionsContextValue | undefined>(undefined)

export type FilterActionsContextValue = {
  addMember: (data: CreateUserRequest) => void
  setAddMember: Dispatch<SetStateAction<(data: CreateUserRequest) => void>>
}

export const FilterActionsProvider = ({ children }: { children: ReactNode }) => {
  const [addMember, setAddMember] = useState<(data: CreateUserRequest) => void>(() => {})
  return <FilterActionsContext value={{ addMember, setAddMember }}>{children}</FilterActionsContext>
}

export const useFilterActions = () => {
  const context = useContext(FilterActionsContext)
  if (!context) {
    throw new Error("useFilterActions must be used within a FilterActionsProvider")
  }
  return context
}
