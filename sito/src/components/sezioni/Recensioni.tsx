import { Star } from 'lucide-react'
import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { Rivela } from '@/components/ui/Rivela'
import { BottoneLink } from '@/components/ui/Bottone'
import { caricaRecensioni } from '@/lib/recensioniGoogle'
import { sito } from '@/lib/config/sito'

function Stelle({ valore, className }: { valore: number; className?: string }) {
  return (
    <span className={`flex items-center gap-0.5 ${className ?? ''}`} aria-label={`${valore} stelle su 5`}>
      {Array.from({ length: 5 }, (_, indice) => (
        <Star
          key={indice}
          className={`h-4 w-4 ${indice < Math.round(valore) ? 'fill-amber-400 text-amber-400' : 'text-[color:var(--bordo)]'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export async function Recensioni() {
  const { elenco, media, totale, fonte } = await caricaRecensioni()

  return (
    <Sezione id="recensioni" sfondoAlternato>
      <IntestazioneSezione
        occhiello="Recensioni"
        titolo={
          <>
            Cinque stelle, <span className="testo-gradiente">una riparazione alla volta</span>
          </>
        }
        sottotitolo={
          fonte === 'google'
            ? 'Recensioni verificate importate automaticamente dalla nostra scheda Google.'
            : 'Le opinioni dei clienti che ci hanno affidato smartphone, computer e impianti.'
        }
      />

      <Rivela className="mx-auto mb-10 flex max-w-md flex-col items-center gap-3 rounded-3xl vetro px-8 py-7 text-center">
        <span className="text-4xl font-extrabold tracking-tight">{media.toFixed(1).replace('.', ',')}</span>
        <Stelle valore={media} />
        <p className="text-sm testo-tenue">
          Basato su {totale} recensioni
          {fonte === 'google' ? ' Google verificate' : ' · aggiornate periodicamente'}
        </p>
      </Rivela>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {elenco.slice(0, 6).map((recensione, indice) => (
          <Rivela as="li" key={`${recensione.autore}-${indice}`} ritardo={indice * 0.06}>
            <figure className="flex h-full flex-col rounded-3xl border border-[color:var(--bordo)] bg-[color:var(--superficie)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-elettrico-500/40">
              <Stelle valore={recensione.valutazione} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">
                “{recensione.testo}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-[color:var(--bordo)] pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-elettrico-500 to-elettrico-700 text-sm font-bold text-white">
                  {recensione.iniziali}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{recensione.autore}</span>
                  <span className="block truncate text-xs testo-tenue">
                    {recensione.dispositivo} · {recensione.data}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Rivela>
        ))}
      </ul>

      <Rivela className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <BottoneLink href={sito.google.recensioni} variante="contorno">
          <Star className="h-4 w-4" aria-hidden="true" />
          Lascia una recensione
        </BottoneLink>
        <BottoneLink href={sito.google.profilo} variante="fantasma">
          Vedi tutte su Google
        </BottoneLink>
      </Rivela>
    </Sezione>
  )
}
