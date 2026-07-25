import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { STATI_RIPARAZIONE } from '@/lib/stati'
import type { StatoRiparazione } from '@/types'

export function Badge({
  children,
  className,
  dot,
}: {
  children: ReactNode
  className?: string
  dot?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-wide uppercase whitespace-nowrap',
        className,
      )}
    >
      {dot && (
        <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} aria-hidden />
      )}
      {children}
    </span>
  )
}

export function BadgeStato({
  stato,
  breve,
  className,
}: {
  stato: StatoRiparazione
  breve?: boolean
  className?: string
}) {
  const config = STATI_RIPARAZIONE[stato]
  return (
    <Badge className={cn(config.badge, className)}>
      {breve ? (config.labelBreve ?? config.label) : config.label}
    </Badge>
  )
}
