'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  type: string
  className?: string
  isError?: boolean
  errorMessage?: string
  isSuccess?: boolean
  successMessage?: string
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type,
      isError,
      className,
      errorMessage,
      isSuccess,
      successMessage,
      disabled,
      ...props
    }: InputProps,
    ref,
  ) => {
    const initialIsTypePassword = type === 'password'
    const [showPassword, setShowPassword] = useState(!initialIsTypePassword)

    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div
        className={cn(
          'flex w-full flex-col',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
      >
        <div className="peer relative h-11">
          <input
            type={initialIsTypePassword ? (showPassword ? 'text' : type) : type}
            placeholder={props.placeholder ? props.placeholder : ' '}
            className={twMerge(
              'peer h-full w-full appearance-none rounded bg-background p-2 outline-none ring-1 ring-inset ring-tertiary/70 transition-colors placeholder:text-tertiary/70 focus:ring-2 focus:ring-primary dark:text-white/70',
              (isError && '!ring-destructive') || (isSuccess && '!ring-success'),
            )}
            {...props}
            ref={ref}
          />
          <span
            className={cn(
              'pointer-events-none absolute left-2 top-0 z-10 -translate-y-[50%] select-none whitespace-nowrap bg-background px-1 text-xs text-tertiary/70 transition-all',
              'peer-focus:top-0 peer-focus:bg-background peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary',
              'peer-placeholder-shown:top-[50%] peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-tertiary/70',
              !!props.placeholder &&
                'peer-placeholder-shown:top-0 peer-placeholder-shown:bg-background peer-placeholder-shown:px-1 peer-placeholder-shown:text-xs',
              (isError && '!text-destructive/70 peer-focus:!text-destructive') ||
                (isSuccess && '!text-success/70 peer-focus:!text-success'),
            )}
          >
            {label}
          </span>
          {initialIsTypePassword && (
            <div
              className="absolute right-2 top-[50%] block aspect-square -translate-y-[50%] cursor-pointer p-1 *:opacity-80 peer-placeholder-shown:hidden"
              onClick={togglePassword}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </div>
          )}
        </div>
        {/* has 3 lines(40px) of error message height */}
        <p
          className={twMerge(
            'max-h-0 w-full select-none text-xs transition-[max-height] duration-150 ease-in-out',
            ((!!errorMessage && isError) || (!!successMessage && isSuccess)) &&
              'max-h-10 select-text',
            isError && 'peer-has[input:focus]:!text-destructive text-destructive/80',
            isSuccess && 'peer-has[input:focus]:!text-success text-success/80',
          )}
        >
          {isError && errorMessage}&nbsp;
          {isSuccess && successMessage}&nbsp;
        </p>
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
