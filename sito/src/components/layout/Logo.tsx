import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Marchio "Io Riparo": monogramma con chiave inglese stilizzata su circuito,
 * disegnato in SVG inline così non pesa sul caricamento.
 */
export function Logo({ className, compatto = false }: { className?: string; compatto?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Io Riparo — torna alla home"
      className={cn('group flex items-center gap-2.5', className)}
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-elettrico-500 to-elettrico-700 shadow-[0_8px_24px_-8px_rgba(47,107,255,0.9)] transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.2 5.6a5.6 5.6 0 0 0-7.3 6.7L5.8 19.4a2.4 2.4 0 0 0 3.4 3.4l7.1-7.1a5.6 5.6 0 0 0 6.7-7.3l-3 3-3.1-.8-.8-3.1 3-3Z" />
          <path d="M6.5 25.5h.01" />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/25" />
      </span>
      {!compatto && (
        <span className="flex flex-col leading-none">
          <span className="text-[1.05rem] font-extrabold tracking-tight">
            Io<span className="testo-gradiente"> Riparo</span>
          </span>
          <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] testo-tenue">
            Assistenza Informatica
          </span>
        </span>
      )}
    </Link>
  )
}
