import "server-only"

import { AuthToken } from "@/lib/utils/auth-token"
import type { User } from "@repo/shared/payload-types"
import { cookies } from "next/headers"

const withCurrentUser = <T,>(Component: React.ComponentType<T & CurrentUserProps>) => {
  let currentUser: User | undefined

  const WrappedComponent = async (props: T) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (token) {
      const auth = new AuthToken(token)

      if (auth.isValid()) {
        currentUser = auth.data?.user
      }
    }

    return <Component {...props} currentUser={currentUser} />
  }
  WrappedComponent.displayName = `withCurrentUser(${Component.displayName})`
  return WrappedComponent
}

export default withCurrentUser

export interface CurrentUserProps {
  currentUser?: User
}
