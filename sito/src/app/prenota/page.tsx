import type { Metadata } from 'next'
import { CalendarClock, Home, MapPin, MonitorSmartphone } from 'lucide-react'
import { ModuloAppuntamento } from '@/components/moduli/ModuloAppuntamento'
import { Rivela } from '@/components/ui/Rivela'
import { sito } from '@/lib/config/sito'
import { schemaBriciole } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Prenota un appuntamento online',
  description:
    'Prenota online il tuo appuntamento da Io Riparo a Tortolì: in negozio, a domicilio o in assistenza remota. Scegli giorno e orario in pochi secondi.',
  alternates: { canonical: '/prenota' },
  openGraph: {
    title: 'Prenota un appuntamento | Io Riparo',
    description: 'Scegli giorno, orario e modalità: in negozio, a domicilio o da remoto.',
    url: '/prenota',
  },
}

const modalita = [
  { icona: MapPin, titolo: 'In negozio', testo: `${sito.indirizzo.via}, ${sito.indirizzo.citta}` },
  { icona: Home, titolo: 'A domicilio', testo: 'Interveniamo a Tortolì e in Ogliastra' },
  { icona: MonitorSmartphone, titolo: 'Da remoto', testo: 'Collegamento sicuro, subito operativi' },
]

export default function PaginaPrenota() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            schemaBriciole([
              { nome: 'Home', percorso: '/' },
              { nome: 'Prenota', percorso: '/prenota' },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 griglia-tecnica" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-elettrico-600/25 blur-[120px]"
          aria-hidden="true"
        />

        <div className="contenitore relative">
          <Rivela className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-elettrico-500/30 bg-elettrico-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-elettrico-400">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Prenotazione online
            </span>
            <h1 className="mt-6 bilancia-testo text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Scegli quando <span className="testo-gradiente">ci vediamo</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed testo-tenue">
              Prenoti in trenta secondi: ti confermiamo l’appuntamento con una chiamata o un
              messaggio WhatsApp.
            </p>
          </Rivela>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {modalita.map((voce, indice) => (
              <Rivela as="li" key={voce.titolo} ritardo={indice * 0.06}>
                <div className="h-full rounded-3xl vetro p-5 text-center">
                  <voce.icona className="mx-auto h-5 w-5 text-elettrico-400" aria-hidden="true" />
                  <h2 className="mt-3 text-sm font-bold">{voce.titolo}</h2>
                  <p className="mt-1 text-xs testo-tenue">{voce.testo}</p>
                </div>
              </Rivela>
            ))}
          </ul>

          <Rivela ritardo={0.1} className="mx-auto mt-10 max-w-3xl">
            <div className="rounded-4xl vetro p-6 md:p-9">
              <ModuloAppuntamento />
            </div>
          </Rivela>
        </div>
      </section>
    </>
  )
}
