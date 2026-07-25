import {
  Gamepad2,
  HardDrive,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import type { TipoDispositivo } from '@/types'

const ICONE = {
  smartphone: Smartphone,
  tablet: Tablet,
  notebook: Laptop,
  desktop: Monitor,
  console: Gamepad2,
  smartwatch: Watch,
  altro: HardDrive,
} as const satisfies Record<TipoDispositivo, unknown>

const DIMENSIONI = {
  sm: 'size-9 rounded-lg',
  md: 'size-11 rounded-xl',
  lg: 'size-14 rounded-xl',
} as const

const ICONA = { sm: 16, md: 20, lg: 26 } as const

/**
 * Anteprima del dispositivo. Nel mockup qui c'è la foto del prodotto:
 * in assenza di immagini reali si usa una piastrella con l'icona di categoria.
 */
export function DeviceIcon({
  tipo,
  dimensione = 'md',
  className,
}: {
  tipo: TipoDispositivo
  dimensione?: keyof typeof DIMENSIONI
  className?: string
}) {
  const Icona = ICONE[tipo]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center border border-line-soft bg-surface-2 text-ink-muted',
        DIMENSIONI[dimensione],
        className,
      )}
      aria-hidden
    >
      <Icona size={ICONA[dimensione]} strokeWidth={1.7} />
    </span>
  )
}
