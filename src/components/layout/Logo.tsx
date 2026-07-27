import { cn } from '@/lib/cn'

/**
 * Marchio ufficiale nella barra laterale del gestionale.
 * Il fondo è sempre scuro: si usa la versione con lettering chiaro.
 */
export function Logo({ compatto, className }: { compatto?: boolean; className?: string }) {
  const altezza = compatto ? 30 : 42

  return (
    <span className={cn('flex items-center', className)}>
      <img
        src="/marchio/logo-chiaro.png"
        alt="IO RIPARO"
        height={altezza}
        width={Math.round((altezza * 2285) / 1498)}
        style={{ height: altezza, width: 'auto' }}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
