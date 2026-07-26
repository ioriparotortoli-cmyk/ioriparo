import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Clock, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import { ModuloPreventivo } from '@/components/moduli/ModuloPreventivo'
import { Rivela } from '@/components/ui/Rivela'
import { schemaBriciole } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Richiedi un preventivo gratuito',
  description:
    'Compila il modulo con le foto del dispositivo e ricevi un preventivo gratuito per la riparazione di smartphone, tablet, PC e Mac. Risposta in poche ore.',
  alternates: { canonical: '/preventivo' },
  openGraph: {
    title: 'Richiedi un preventivo gratuito | Io Riparo',
    description:
      'Preventivo gratuito e senza impegno per la riparazione del tuo dispositivo. Allega le foto e ricevi costi e tempi.',
    url: '/preventivo',
  },
}

const punti = [
  { icona: Wallet, testo: 'Preventivo e diagnosi sempre gratuiti' },
  { icona: Clock, testo: 'Risposta entro poche ore negli orari di apertura' },
  { icona: ShieldCheck, testo: 'Nessun intervento senza la tua approvazione' },
  { icona: Sparkles, testo: 'Allega le foto: la valutazione è più precisa' },
]

export default function PaginaPreventivo() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            schemaBriciole([
              { nome: 'Home', percorso: '/' },
              { nome: 'Preventivo', percorso: '/preventivo' },
            ]),
          ),
        }}
      />

      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 griglia-tecnica" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-elettrico-600/25 blur-[120px]"
          aria-hidden="true"
        />

        <div className="contenitore relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Rivela direzione="destra">
              <span className="inline-flex items-center gap-2 rounded-full border border-elettrico-500/30 bg-elettrico-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-elettrico-400">
                Preventivo gratuito
              </span>
              <h1 className="mt-6 bilancia-testo text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Dicci cosa è successo, <span className="testo-gradiente">al resto pensiamo noi</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed testo-tenue">
                Descrivi il problema e allega qualche foto del dispositivo: ti rispondiamo con costi,
                tempi e ricambi previsti, senza alcun impegno.
              </p>
            </Rivela>

            <Rivela direzione="destra" ritardo={0.1}>
              <ul className="mt-9 space-y-3">
                {punti.map((punto) => (
                  <li key={punto.testo} className="flex items-start gap-3 rounded-2xl vetro px-4 py-3.5">
                    <punto.icona className="mt-0.5 h-5 w-5 shrink-0 text-elettrico-400" aria-hidden="true" />
                    <span className="text-sm">{punto.testo}</span>
                  </li>
                ))}
              </ul>
            </Rivela>
          </div>

          <Rivela direzione="sinistra" ritardo={0.08}>
            <div className="rounded-4xl vetro p-6 md:p-9">
              <Suspense fallback={<p className="text-sm testo-tenue">Caricamento del modulo…</p>}>
                <ModuloPreventivo />
              </Suspense>
            </div>
          </Rivela>
        </div>
      </section>
    </>
  )
}
