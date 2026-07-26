import { cn } from '@/lib/utils'
import { Rivela } from './Rivela'

export function Sezione({
  id,
  className,
  children,
  sfondoAlternato = false,
}: {
  id?: string
  className?: string
  children: React.ReactNode
  sfondoAlternato?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 md:py-28',
        sfondoAlternato && 'superficie-alt',
        className,
      )}
    >
      <div className="contenitore">{children}</div>
    </section>
  )
}

export function IntestazioneSezione({
  occhiello,
  titolo,
  sottotitolo,
  centrato = true,
  className,
}: {
  occhiello?: string
  titolo: React.ReactNode
  sottotitolo?: string
  centrato?: boolean
  className?: string
}) {
  return (
    <Rivela className={cn('mb-12 md:mb-16', centrato && 'mx-auto text-center', className)}>
      <div className={cn('max-w-3xl', centrato && 'mx-auto')}>
        {occhiello && (
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-elettrico-500/30 bg-elettrico-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-elettrico-400">
            <span className="h-1.5 w-1.5 rounded-full bg-elettrico-500 animate-pulsazione" />
            {occhiello}
          </span>
        )}
        <h2 className="bilancia-testo text-3xl font-extrabold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {titolo}
        </h2>
        {sottotitolo && (
          <p className="mt-4 text-base leading-relaxed testo-tenue md:text-lg">{sottotitolo}</p>
        )}
      </div>
    </Rivela>
  )
}
