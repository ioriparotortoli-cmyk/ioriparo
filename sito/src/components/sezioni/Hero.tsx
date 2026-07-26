import { MessageCircle, Phone, ShieldCheck, Sparkles, Star, Timer } from 'lucide-react'
import { BottoneLink } from '@/components/ui/Bottone'
import { Rivela } from '@/components/ui/Rivela'
import { IllustrazioneDispositivi } from './IllustrazioneDispositivi'
import { linkTelefono, linkWhatsapp, sito } from '@/lib/config/sito'

const indicatori = [
  { icona: Timer, valore: '30 min', etichetta: 'riparazioni espresse' },
  { icona: ShieldCheck, valore: '12 mesi', etichetta: 'di garanzia' },
  { icona: Star, valore: '5,0 ★', etichetta: 'recensioni Google' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute inset-0 griglia-tecnica" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-elettrico-600/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-elettrico-400/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="contenitore relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Rivela direzione="destra">
            <span className="inline-flex items-center gap-2 rounded-full border border-elettrico-500/30 bg-elettrico-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-elettrico-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Centro assistenza a {sito.indirizzo.citta}
            </span>
          </Rivela>

          <Rivela direzione="destra" ritardo={0.08}>
            <h1 className="mt-6 bilancia-testo text-[2.1rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Riparazione <span className="testo-gradiente">Smartphone</span>, Computer e Assistenza
              Informatica
            </h1>
          </Rivela>

          <Rivela direzione="destra" ritardo={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed testo-tenue md:text-lg">
              Riparazioni professionali, ricambi di qualità e assistenza veloce per privati e
              aziende.
            </p>
          </Rivela>

          <Rivela direzione="su" ritardo={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BottoneLink href="/preventivo" dimensione="lg">
                Richiedi Preventivo
              </BottoneLink>
              <BottoneLink href={linkWhatsapp} variante="whatsapp" dimensione="lg">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Contattaci su WhatsApp
              </BottoneLink>
              <BottoneLink href={linkTelefono} variante="contorno" dimensione="lg">
                <Phone className="h-5 w-5" aria-hidden="true" />
                Chiama Ora
              </BottoneLink>
            </div>
          </Rivela>

          <Rivela direzione="su" ritardo={0.32}>
            <dl className="mt-11 grid max-w-lg grid-cols-3 gap-4">
              {indicatori.map((indicatore) => (
                <div
                  key={indicatore.etichetta}
                  className="rounded-2xl vetro px-4 py-4 text-center transition-transform duration-300 hover:-translate-y-1"
                >
                  <indicatore.icona
                    className="mx-auto mb-2 h-5 w-5 text-elettrico-400"
                    aria-hidden="true"
                  />
                  <dt className="sr-only">{indicatore.etichetta}</dt>
                  <dd>
                    <span className="block text-lg font-extrabold tracking-tight">
                      {indicatore.valore}
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] leading-tight testo-tenue">
                      {indicatore.etichetta}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Rivela>
        </div>

        <Rivela direzione="sinistra" ritardo={0.15}>
          <IllustrazioneDispositivi />
        </Rivela>
      </div>
    </section>
  )
}
