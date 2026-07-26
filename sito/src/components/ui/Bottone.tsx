import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variante = 'primario' | 'whatsapp' | 'contorno' | 'fantasma'
type Dimensione = 'md' | 'lg'

const varianti: Record<Variante, string> = {
  primario:
    'bg-elettrico-600 text-white hover:bg-elettrico-500 shadow-[0_10px_30px_-10px_rgba(23,146,209,0.85)]',
  whatsapp: 'bg-[#25D366] text-[#04120a] hover:bg-[#1fbe5b] shadow-[0_10px_30px_-12px_rgba(37,211,102,0.8)]',
  contorno:
    'border border-[color:var(--bordo)] vetro text-[color:var(--testo)] hover:border-elettrico-500/60 hover:text-elettrico-400',
  fantasma: 'text-[color:var(--testo)] hover:bg-elettrico-500/10 hover:text-elettrico-400',
}

const dimensioni: Record<Dimensione, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-6 text-[0.95rem] md:h-14 md:px-7',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'

type Proprieta = {
  variante?: Variante
  dimensione?: Dimensione
  className?: string
  children: React.ReactNode
}

export function Bottone({
  variante = 'primario',
  dimensione = 'md',
  className,
  children,
  ...resto
}: Proprieta & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, varianti[variante], dimensioni[dimensione], className)} {...resto}>
      {children}
    </button>
  )
}

export function BottoneLink({
  variante = 'primario',
  dimensione = 'md',
  className,
  href,
  esterno = false,
  children,
  ...resto
}: Proprieta & { href: string; esterno?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classi = cn(base, varianti[variante], dimensioni[dimensione], className)

  if (esterno || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={classi}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...resto}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classi} {...resto}>
      {children}
    </Link>
  )
}
