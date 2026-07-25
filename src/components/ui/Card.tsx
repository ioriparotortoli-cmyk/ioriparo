import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Card({
  children,
  className,
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <section
      className={cn(
        'rounded-card border border-line bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.4)]',
        padding && 'p-5',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function CardHeader({
  titolo,
  sottotitolo,
  azione,
  className,
}: {
  titolo: ReactNode
  sottotitolo?: ReactNode
  azione?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-ink">{titolo}</h2>
        {sottotitolo && <p className="mt-0.5 text-xs text-ink-faint">{sottotitolo}</p>}
      </div>
      {azione && <div className="shrink-0">{azione}</div>}
    </header>
  )
}

/** Piede della card con il link «Vedi tutto». */
export function CardFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="-mx-5 -mb-5 mt-4 border-t border-line px-5 py-3 text-sm">{children}</footer>
  )
}
