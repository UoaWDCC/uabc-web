import React, { createContext, useContext, type PropsWithChildren, memo } from 'react'

type SemesterDetailCardProps = {
  id: number
  name: string
  startDate: string
  endDate: string
  breakStart: string
  breakEnd: string
  bookingOpenDay: string
  bookingOpenTime: string
}

const SemesterContext = createContext<SemesterDetailCardProps>({} as SemesterDetailCardProps)

export const useSemesterContext = () => {
  const context = useContext(SemesterContext)
  if (!context) {
    throw new Error('useSemesterContext must be used within a SemesterContextProvider')
  }
  return context
}

const UnmemoizedSemesterContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: SemesterDetailCardProps }>) => {
  return <SemesterContext.Provider value={value}>{children}</SemesterContext.Provider>
}

export const SemesterContextProvider = memo(UnmemoizedSemesterContextProvider)
