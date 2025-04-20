'use client'

import { usePathname } from 'next/navigation'
import { createContext, useEffect, useRef, useState } from 'react'

export const OriginContext = createContext<boolean>(false)

export default function OriginTracker({ children }: React.PropsWithChildren) {
  const [isWithinPage, setIsWithinPage] = useState(false)
  const isInitialLoadRef = useRef(true)
  const pathname = usePathname()

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      return
    }

    setIsWithinPage(true)
    return () => setIsWithinPage(false)
  }, [pathname])

  return <OriginContext.Provider value={isWithinPage}>{children}</OriginContext.Provider>
}
