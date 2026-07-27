import { cn } from '@/lib/cn'
import { Simbolo } from '@/sito/componenti/Marchio'

/** Marchio IO RIPARO nella barra laterale del gestionale. */
export function Logo({
  compatto,
  className,
}: {
  compatto?: boolean
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Simbolo dimensione={compatto ? 28 : 34} fondo="var(--color-surface)" />

      {!compatto && (
        <span className="min-w-0">
          <span className="block text-[17px] leading-none font-extrabold tracking-tight text-white">
            IO RIPARO
          </span>
          <span className="mt-1 block text-[8px] font-semibold tracking-[0.18em] text-ink-faint uppercase">
            Assistenza e Riparazioni
          </span>
        </span>
      )}
    </span>
  )
}
