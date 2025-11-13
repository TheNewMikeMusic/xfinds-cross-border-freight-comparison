'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'

type FieldState = 'default' | 'error' | 'success'

export interface FloatingInputProps
  extends React.ComponentProps<typeof Input> {
  label: string
  hint?: string
  error?: string
  state?: FieldState
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, hint, error, state = 'default', className, onFocus, onBlur, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const rawValue = props.value ?? props.defaultValue ?? ''
    const hasValue =
      typeof rawValue === 'number' ? rawValue.toString().length > 0 : Boolean(rawValue)
    const isActive = isFocused || hasValue
    const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined
    const labelId = id ? `${id}-label` : undefined

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(event)
    }

    return (
      <div className="floating-label-field" data-floating-active={isActive}>
        <span id={labelId}>{label}</span>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={state === 'error'}
            aria-describedby={messageId}
            aria-labelledby={labelId}
            className={cn(
              'h-14 rounded-2xl border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-white dark:bg-gray-900/60 px-4 py-3 text-base text-gray-900 dark:text-white transition-all placeholder-transparent',
              state === 'error'
                ? 'border-red-500/60 dark:border-red-400/60 focus-visible:ring-red-500/40 dark:focus-visible:ring-red-400/40'
                : 'focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40',
              className
            )}
            {...props}
          />
          {state === 'success' && (
            <CheckCircle
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600 dark:text-emerald-400"
            />
          )}
          {state === 'error' && (
            <AlertCircle
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-600 dark:text-red-400"
            />
          )}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {error ? (
            <motion.p
              key="error"
              id={messageId}
              className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              id={messageId}
              className="mt-2 text-sm text-muted-foreground dark:text-gray-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'
