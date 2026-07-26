import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Dimensioni native dei file originali del marchio, già rifilati. */
const LOCKUP = { larghezza: 900, altezza: 590 }

/**
 * Marchio Io Riparo: viene usato il logo originale così com'è, senza
 * ricomposizioni. Esistono due file identici nella forma e diversi solo nel
 * colore del testo — bianco per i fondi scuri, nero per quelli chiari — e si
 * alternano con il tema tramite le utility di visibilità.
 */
export function Logo({
  className,
  compatto = false,
  priorita = false,
}: {
  className?: string
  compatto?: boolean
  priorita?: boolean
}) {
  const altezza = compatto ? 'h-12' : 'h-13 md:h-14'
  const larghezze = compatto ? '74px' : '(min-width: 768px) 86px, 80px'

  return (
    <Link
      href="/"
      aria-label="Io Riparo, come posso aiutare? Torna alla home"
      className={cn('group flex shrink-0 items-center', className)}
    >
      <Image
        src="/marchio/lockup-chiaro.png"
        alt="Io Riparo — come posso aiutare?"
        width={LOCKUP.larghezza}
        height={LOCKUP.altezza}
        priority={priorita}
        quality={95}
        sizes={larghezze}
        className={cn(
          'hidden w-auto transition-transform duration-300 group-hover:scale-[1.03] dark:block',
          altezza,
        )}
      />
      <Image
        src="/marchio/lockup-scuro.png"
        alt="Io Riparo — come posso aiutare?"
        width={LOCKUP.larghezza}
        height={LOCKUP.altezza}
        priority={priorita}
        quality={95}
        sizes={larghezze}
        className={cn(
          'block w-auto transition-transform duration-300 group-hover:scale-[1.03] dark:hidden',
          altezza,
        )}
      />
    </Link>
  )
}

/**
 * Lockup del marchio in dimensione estesa, per il piè di pagina e i contesti
 * in cui c'è spazio a sufficienza.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/marchio/lockup-chiaro.png"
        alt="Io Riparo — come posso aiutare?"
        width={LOCKUP.larghezza}
        height={LOCKUP.altezza}
        quality={95}
        sizes="220px"
        className={cn('hidden h-auto w-[13.5rem] dark:block', className)}
      />
      <Image
        src="/marchio/lockup-scuro.png"
        alt="Io Riparo — come posso aiutare?"
        width={LOCKUP.larghezza}
        height={LOCKUP.altezza}
        quality={95}
        sizes="220px"
        className={cn('block h-auto w-[13.5rem] dark:hidden', className)}
      />
    </>
  )
}
