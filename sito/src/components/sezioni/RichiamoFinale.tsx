import { MessageCircle, Phone } from 'lucide-react'
import { BottoneLink } from '@/components/ui/Bottone'
import { Rivela } from '@/components/ui/Rivela'
import { linkTelefono, linkWhatsapp } from '@/lib/config/sito'

export function RichiamoFinale() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="contenitore">
        <Rivela direzione="zoom">
          <div className="relative overflow-hidden rounded-4xl border border-elettrico-500/30 bg-gradient-to-br from-elettrico-700 via-elettrico-600 to-elettrico-800 px-7 py-14 text-center md:px-16">
            <span
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-black/25 blur-3xl"
              aria-hidden="true"
            />

            <h2 className="relative bilancia-testo text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Il tuo dispositivo ha bisogno di aiuto?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-base text-white/85">
              Diagnosi e preventivo gratuiti. Portacelo in negozio o raccontaci il problema: ti
              diciamo subito costi e tempi.
            </p>

            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <BottoneLink
                href="/preventivo"
                dimensione="lg"
                className="bg-white text-elettrico-700 shadow-none hover:bg-elettrico-50"
              >
                Richiedi Preventivo
              </BottoneLink>
              <BottoneLink href={linkWhatsapp} variante="whatsapp" dimensione="lg">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Contattaci su WhatsApp
              </BottoneLink>
              <BottoneLink
                href={linkTelefono}
                dimensione="lg"
                className="border border-white/40 bg-white/10 text-white shadow-none backdrop-blur hover:bg-white/20"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Chiama Ora
              </BottoneLink>
            </div>
          </div>
        </Rivela>
      </div>
    </section>
  )
}
