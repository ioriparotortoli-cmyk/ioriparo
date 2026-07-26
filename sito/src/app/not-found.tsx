import type { Metadata } from 'next'
import { BottoneLink } from '@/components/ui/Bottone'
import { linkWhatsapp } from '@/lib/config/sito'

export const metadata: Metadata = {
  title: 'Pagina non trovata',
  robots: { index: false, follow: true },
}

export default function NonTrovata() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center px-5 pt-28">
      <div className="pointer-events-none absolute inset-0 griglia-tecnica" aria-hidden="true" />
      <div className="relative text-center">
        <p className="text-7xl font-extrabold tracking-tight testo-gradiente">404</p>
        <h1 className="mt-4 text-2xl font-bold">Questa pagina non esiste (o l’abbiamo smontata)</h1>
        <p className="mx-auto mt-3 max-w-md text-sm testo-tenue">
          Il collegamento potrebbe essere scaduto. Torna alla home oppure scrivici: troviamo noi
          quello che cerchi.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <BottoneLink href="/">Torna alla home</BottoneLink>
          <BottoneLink href={linkWhatsapp} variante="contorno">
            Scrivici su WhatsApp
          </BottoneLink>
        </div>
      </div>
    </section>
  )
}
