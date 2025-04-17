'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@yamada-ui/react'

import GoogleIcon from '@/../public/images/googleIcon.svg'

export const GoogleLoginButton = () => {
  return (
    <Button
      onClick={() => {
        throw new Error('NOT IMPLEMENTED')
      }}
      startIcon={<Image src={GoogleIcon} width={20} height={20} alt="Google Icon" />}
      colorScheme="neutral"
      variant="outline"
    >
      Continue with Google
    </Button>
  )
}
