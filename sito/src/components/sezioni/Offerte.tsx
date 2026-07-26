import { CalendarClock, Tag } from 'lucide-react'
import { Rivela } from '@/components/ui/Rivela'
import { BottoneLink } from '@/components/ui/Bottone'
import { caricaOfferte } from '@/lib/dati/offerte'
import { giorno } from '@/lib/utils'

export async function Offerte() {
  const offerte = await caricaOfferte()
  if (offerte.length === 0) return null

  return (
    <section id="offerte" className="scroll-mt-24 pb-4 pt-6 md:pb-8">
      <div className="contenitore">
        <ul className="grid gap-4 md:grid-cols-3">
          {offerte.map((offerta, indice) => (
            <Rivela as="li" key={offerta.id} ritardo={indice * 0.07}>
              <article className="relative h-full overflow-hidden rounded-3xl border border-elettrico-500/40 bg-gradient-to-br from-elettrico-600/15 to-transparent p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-elettrico-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  {offerta.sconto ?? 'Promozione'}
                </span>
                <h3 className="mt-4 text-lg font-bold">{offerta.titolo}</h3>
                <p className="mt-2 text-sm leading-relaxed testo-tenue">{offerta.descrizione}</p>
                {offerta.valida_fino && (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-xs testo-tenue">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    Valida fino al {giorno(offerta.valida_fino)}
                  </p>
                )}
                <BottoneLink href="/preventivo" variante="fantasma" className="mt-4 px-0">
                  Approfitta dell’offerta →
                </BottoneLink>
              </article>
            </Rivela>
          ))}
        </ul>
      </div>
    </section>
  )
}
