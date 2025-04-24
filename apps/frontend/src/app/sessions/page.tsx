import { LogOut } from "lucide-react"
import Image from "next/image"

import { LogOutButton } from "@/components/Composite/LogOutButton"
import { PrepaidSessionsCounter } from "@/components/Composite/booking/sessions/PrepaidSessionsCounter"
import type { CurrentUserProps } from "@/lib/hoc/withCurrentUser"
import withCurrentUser from "@/lib/hoc/withCurrentUser"
import { getUserFromId } from "@/services/user"
import { Heading } from "@repo/ui/components/Heading"
import ClientSessionPage from "./client-page"

import BadmintonRacketLogo from "../../public/images/BadmintonRacketLogo.png"

export const metadata = {
  title: "Session Booking - UABC Booking Portal",
}

async function SelectSessionPage({ currentUser }: CurrentUserProps) {
  const user = (await getUserFromId(currentUser.id)) ?? null

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex items-center justify-between p-4">
        <Heading>Sessions</Heading>
        <LogOutButton>
          <LogOut size={24} />
        </LogOutButton>
      </div>
      <div className="flex h-16 items-center justify-between bg-secondary/70 p-4">
        <div className="flex items-center">
          <span className="pr-1 font-medium">Hey {user.firstName}!</span>
          <Image
            alt="Badminton Racket Logo"
            className="pointer-events-none select-none"
            height={20}
            src={BadmintonRacketLogo}
            width={20}
          />
        </div>
        {user.member && <PrepaidSessionsCounter prepaidSessions={user.prepaidSessions} />}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          {user.member && <PrepaidSessionsCounter prepaidSessions={user.prepaidSessions} />}
        </div>
        <ClientSessionPage isMember={!!user.member} prepaidSessions={user.prepaidSessions} />
      </div>
    </div>
  )
}

export default withCurrentUser(SelectSessionPage)
