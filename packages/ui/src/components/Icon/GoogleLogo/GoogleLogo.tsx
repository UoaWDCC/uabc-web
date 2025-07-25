"use client"

import { Icon, type IconProps } from "@yamada-ui/react"
import { type FC, memo } from "react"

export interface GoogleLogoProps extends IconProps {}

export const GoogleLogo: FC<GoogleLogoProps> = memo((props) => {
  return (
    <Icon fill="none" strokeWidth="3px" viewBox="0 0 48 48" {...props}>
      <path
        clipRule="evenodd"
        d="M47.0399 24.5458C47.0399 22.844 46.8872 21.2076 46.6035 19.6367H23.9999V28.9204H36.9162C36.3599 31.9204 34.669 34.4622 32.1272 36.164V42.1858H39.8835C44.4217 38.0076 47.0399 31.8549 47.0399 24.5458Z"
        fill="#4285F4"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M23.9999 47.9996C30.4799 47.9996 35.9126 45.8505 39.8835 42.185L32.1272 36.1632C29.9781 37.6032 27.229 38.4541 23.9999 38.4541C17.749 38.4541 12.4581 34.2323 10.5708 28.5596H2.55261V34.7778C6.5017 42.6214 14.6181 47.9996 23.9999 47.9996Z"
        fill="#34A853"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M10.5708 28.5599C10.0908 27.1199 9.81806 25.5817 9.81806 23.9999C9.81806 22.418 10.0908 20.8799 10.5708 19.4399V13.2217H2.55261C0.927151 16.4617 -0.00012207 20.1271 -0.00012207 23.9999C-0.00012207 27.8726 0.927151 31.538 2.55261 34.778L10.5708 28.5599Z"
        fill="#FBBC05"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M23.9999 9.54545C27.5235 9.54545 30.6872 10.7564 33.1744 13.1345L40.0581 6.25091C35.9017 2.37818 30.469 0 23.9999 0C14.6181 0 6.5017 5.37818 2.55261 13.2218L10.5708 19.44C12.4581 13.7673 17.749 9.54545 23.9999 9.54545Z"
        fill="#EA4335"
        fillRule="evenodd"
      />
    </Icon>
  )
})

GoogleLogo.displayName = "GoogleLogo"
