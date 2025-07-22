"use client"
import { NavigationBar, type NavigationBarProps } from "@repo/ui/components/Generic"
import { useAuth } from "@/context/AuthContext"

export const NavbarSection: React.FC<NavigationBarProps> = ({ ...props }) => {
  const { user } = useAuth()
  return <NavigationBar {...props} user={user} />
}
