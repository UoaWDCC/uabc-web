import "server-only"

import { redirect } from "next/navigation"

const withCurrentUser = <T,>(Component: React.ComponentType<T & CurrentUserProps>) => {
  const WrappedComponent = async (props: T) => {
    const currentUser = {
      id: "1",
    }
    if (!currentUser) redirect("/auth/login")

    return <Component {...props} currentUser={currentUser} />
  }
  WrappedComponent.displayName = `withCurrentUser(${Component.displayName})`
  return WrappedComponent
}

export default withCurrentUser

export interface CurrentUserProps {
  // TODO: Replace any with the correct type
  // This is a placeholder for now
  currentUser: {
    id: string
  }
}
