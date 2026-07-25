import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variante = 'primario' | 'secondario' | 'fantasma' | 'pericolo' | 'successo'
type Dimensione = 'sm' | 'md'

const VARIANTI: Record<Variante, string> = {
  primario: 'bg-brand text-white hover:bg-brand-hover border-transparent',
  secondario: 'bg-surface-2 text-ink hover:bg-surface-3 border-line-soft',
  fantasma: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-2 border-transparent',
  pericolo: 'bg-rose-500/12 text-rose-300 hover:bg-rose-500/20 border-rose-500/30',
  successo: 'bg-emerald-500/12 text-emerald-300 hover:bg-emerald-500/20 border-emerald-500/30',
}

const DIMENSIONI: Record<Dimensione, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
}

function classiBottone(variante: Variante, dimensione: Dimensione, className?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-lg border font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTI[variante],
    DIMENSIONI[dimensione],
    className,
  )
}

interface PropsBottone extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  dimensione?: Dimensione
  children: ReactNode
}

export function Button({
  variante = 'secondario',
  dimensione = 'md',
  className,
  children,
  ...resto
}: PropsBottone) {
  return (
    <button type="button" className={classiBottone(variante, dimensione, className)} {...resto}>
      {children}
    </button>
  )
}

export function LinkButton({
  to,
  variante = 'secondario',
  dimensione = 'md',
  className,
  children,
}: {
  to: string
  variante?: Variante
  dimensione?: Dimensione
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={classiBottone(variante, dimensione, className)}>
      {children}
    </Link>
  )
}

/** Bottone quadrato per le azioni di riga (occhio, matita, cestino). */
export function IconButton({
  etichetta,
  tono = 'neutro',
  className,
  children,
  ...resto
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  etichetta: string
  tono?: 'neutro' | 'blu' | 'rosso'
  children: ReactNode
}) {
  const toni = {
    neutro: 'bg-surface-3 text-ink-muted hover:text-ink hover:bg-line-soft border-line-soft',
    blu: 'bg-brand text-white hover:bg-brand-hover border-transparent',
    rosso: 'bg-rose-600/90 text-white hover:bg-rose-600 border-transparent',
  }
  return (
    <button
      type="button"
      title={etichetta}
      aria-label={etichetta}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg border transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        toni[tono],
        className,
      )}
      {...resto}
    >
      {children}
    </button>
  )
}
