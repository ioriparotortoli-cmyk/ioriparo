import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Marchio Io Riparo in versione orizzontale: il simbolo originale del logo
 * affiancato al wordmark e al payoff, composti con i caratteri del marchio.
 * Il lockup verticale originale resta disponibile come `Lockup`.
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
  return (
    <Link
      href="/"
      aria-label="Io Riparo — torna alla home"
      className={cn('group flex shrink-0 items-center gap-2.5', className)}
    >
      <Image
        src="/marchio/simbolo.png"
        alt=""
        width={1342}
        height={1311}
        priority={priorita}
        sizes="48px"
        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 md:h-11"
      />

      {!compatto && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.15rem] font-extrabold uppercase tracking-[0.01em] md:text-[1.3rem]">
            Io Riparo
          </span>
          <span className="payoff mt-1 text-[0.68rem] testo-tenue md:text-[0.72rem]">
            come posso aiutare?
          </span>
        </span>
      )}
    </Link>
  )
}

/**
 * Lockup completo originale (simbolo, wordmark e payoff impilati), da usare
 * dove c'è spazio: piè di pagina, pagine di cortesia, materiali condivisi.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/marchio/lockup-chiaro.png"
        alt="Io Riparo — come posso aiutare?"
        width={900}
        height={590}
        sizes="220px"
        className={cn('hidden h-auto w-[13.5rem] dark:block', className)}
      />
      <Image
        src="/marchio/lockup-scuro.png"
        alt="Io Riparo — come posso aiutare?"
        width={900}
        height={590}
        sizes="220px"
        className={cn('block h-auto w-[13.5rem] dark:hidden', className)}
      />
    </>
  )
}
