'use client'

import { EyeIcon, EyeOffIcon } from '@yamada-ui/lucide'
import {
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Label,
  useBoolean,
  type InputProps as UIInputProps,
} from '@yamada-ui/react'
import { forwardRef } from 'react'

export interface InputProps extends Omit<UIInputProps, 'type'> {
  label?: string
  type: string
  isError?: boolean
  errorMessage?: string
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, isError, errorMessage, disabled, placeholder, ...props }: InputProps, ref) => {
    const initialIsTypePassword = type === 'password'
    const [passwordShown, { toggle }] = useBoolean(!initialIsTypePassword)

    return (
      <FormControl
        disabled={disabled}
        invalid={isError}
        errorMessage={errorMessage}
        position="relative"
      >
        <InputGroup>
          <Input
            ref={ref}
            type={initialIsTypePassword ? (passwordShown ? 'text' : type) : type}
            placeholder={placeholder || ' '}
            className="peer"
            borderWidth="2"
            borderColor="transparentize(tertiary.500, 70%)"
            _hover={{
              borderColor: 'transparentize(tertiary.500, 70%)',
              boxShadow: 'none',
            }}
            _active={{
              borderColor: 'primary',
              boxShadow: 'none',
            }}
            _focusVisible={{
              borderColor: 'primary',
              boxShadow: 'none',
            }}
            _placeholder={{ opacity: 0 }}
            rounded="sm"
            {...props}
          />
          {initialIsTypePassword && (
            <InputRightElement clickable>
              <IconButton h="1.75rem" size="sm" onClick={toggle} variant="ghost">
                {passwordShown ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            </InputRightElement>
          )}
        </InputGroup>
        <Label
          position="absolute"
          top="0"
          left="sm"
          px="xs"
          transition="all 0.2s"
          mb="0"
          _peerPlaceholderShown={{
            transform: 'translateY(35%)',
            color: 'gray',
          }}
          _peerFocus={{
            top: 0,
            left: 'sm',
            transform: 'translateY(-50%) scale(0.8)',
            zIndex: 1,
            bg: ['white', 'black'],
            color: 'primary',
          }}
          sx={{
            '&:not(:placeholder-shown)': {
              top: 0,
              left: 'sm',
              transform: 'translateY(-50%) scale(0.8)',
              zIndex: 1,
              bg: ['white', 'black'],
              color: 'gray',
            },
          }}
        >
          {label}
        </Label>
      </FormControl>
    )
  },
)

TextInput.displayName = 'TextInput'
