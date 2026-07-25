import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export type TonoStat = 'blu' | 'verde' | 'ambra' | 'viola' | 'ciano' | 'rosa'

const TONI: Record<TonoStat, string> = {
  blu: 'bg-blue-600 text-white',
  verde: 'bg-emerald-600 text-white',
  ambra: 'bg-amber-500 text-white',
  viola: 'bg-violet-600 text-white',
  ciano: 'bg-cyan-600 text-white',
  rosa: 'bg-rose-600 text-white',
}

/** Riquadro statistica della dashboard: icona tonda, valore grande, link. */
export function StatCard({
  etichetta,
  valore,
  icona: Icona,
  tono = 'blu',
  link,
  testoLink = 'Vedi tutte',
}: {
  etichetta: string
  valore: string | number
  icona: LucideIcon
  tono?: TonoStat
  link?: string
  testoLink?: string
}) {
  return (
    <article className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            TONI[tono],
          )}
        >
          <Icona size={20} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] leading-tight font-bold tracking-wider text-ink-faint uppercase">
            {etichetta}
          </p>
          <p className="mt-0.5 text-xl font-bold whitespace-nowrap text-ink" title={String(valore)}>
            {valore}
          </p>
        </div>
      </div>
      {link && (
        <Link
          to={link}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          {testoLink}
          <ArrowRight size={13} />
        </Link>
      )}
    </article>
  )
}

/** Pastiglia di riepilogo usata come filtro rapido nelle liste. */
export function StatChip({
  etichetta,
  valore,
  unita,
  icona: Icona,
  colore,
  attivo,
  onClick,
}: {
  etichetta: string
  valore: number
  unita?: string
  icona: LucideIcon
  colore: string
  attivo?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={attivo}
      className={cn(
        'flex min-w-0 flex-1 items-center gap-3 rounded-card border p-3.5 text-left transition-colors',
        attivo
          ? 'border-brand bg-brand/10'
          : 'border-line bg-surface hover:border-line-soft hover:bg-surface-2',
      )}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: colore }}
      >
        <Icona size={17} strokeWidth={2.2} className="text-white" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs leading-tight text-ink-muted">{etichetta}</span>
        <span className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-lg leading-none font-bold text-ink">{valore}</span>
          {unita && <span className="text-[11px] text-ink-faint">{unita}</span>}
        </span>
      </span>
    </button>
  )
}
