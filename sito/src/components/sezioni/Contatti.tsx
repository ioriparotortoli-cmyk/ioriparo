import { CalendarClock, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { Rivela } from '@/components/ui/Rivela'
import { BottoneLink } from '@/components/ui/Bottone'
import { ModuloContatti } from '@/components/moduli/ModuloContatti'
import { embedMappa, linkEmail, linkMappa, linkTelefono, linkWhatsapp, sito } from '@/lib/config/sito'

export function Contatti() {
  return (
    <Sezione id="contatti" className="overflow-hidden">
      <IntestazioneSezione
        occhiello="Contatti"
        titolo={
          <>
            Dove siamo e come <span className="testo-gradiente">raggiungerci</span>
          </>
        }
        sottotitolo="Passa in negozio a Tortolì, scrivici su WhatsApp o compila il modulo: rispondiamo in giornata."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-6">
          <Rivela direzione="destra">
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="rounded-3xl vetro p-6">
                <MapPin className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wider testo-tenue">Indirizzo</h3>
                <a
                  href={linkMappa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 block text-[0.95rem] font-semibold transition-colors hover:text-elettrico-400"
                >
                  {sito.indirizzo.via}
                  <br />
                  {sito.indirizzo.cap} {sito.indirizzo.citta} ({sito.indirizzo.provincia})
                </a>
              </li>

              <li className="rounded-3xl vetro p-6">
                <Phone className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wider testo-tenue">Telefono</h3>
                <a
                  href={linkTelefono}
                  className="mt-1.5 block text-[0.95rem] font-semibold transition-colors hover:text-elettrico-400"
                >
                  {sito.contatti.telefonoVisibile}
                </a>
              </li>

              <li className="rounded-3xl vetro p-6">
                <MessageCircle className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wider testo-tenue">WhatsApp</h3>
                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 block text-[0.95rem] font-semibold transition-colors hover:text-elettrico-400"
                >
                  Scrivici ora
                </a>
              </li>

              <li className="rounded-3xl vetro p-6">
                <Mail className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wider testo-tenue">Email</h3>
                <a
                  href={linkEmail}
                  className="mt-1.5 block break-all text-[0.95rem] font-semibold transition-colors hover:text-elettrico-400"
                >
                  {sito.contatti.email}
                </a>
              </li>
            </ul>
          </Rivela>

          <Rivela direzione="destra" ritardo={0.08}>
            <div className="rounded-3xl vetro p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider testo-tenue">
                <Clock className="h-4 w-4 text-elettrico-400" aria-hidden="true" />
                Orari di apertura
              </h3>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {sito.orari.map((riga) => (
                    <tr key={riga.giorni} className="border-t border-[color:var(--bordo)] first:border-0">
                      <th scope="row" className="py-2.5 text-left font-semibold">
                        {riga.giorni}
                      </th>
                      <td className="py-2.5 text-right testo-tenue">
                        {riga.apertura === 'Chiuso'
                          ? 'Chiuso'
                          : `${riga.apertura}–${riga.chiusura}${
                              riga.pomeriggio !== 'Chiuso' ? ` · ${riga.pomeriggio}` : ''
                            }`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <BottoneLink href="/prenota" variante="contorno" className="mt-5 w-full">
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Prenota un appuntamento
              </BottoneLink>
            </div>
          </Rivela>

          <Rivela direzione="destra" ritardo={0.14}>
            <div className="overflow-hidden rounded-3xl border border-[color:var(--bordo)]">
              <iframe
                src={embedMappa}
                title={`Mappa: ${sito.nome}, ${sito.indirizzo.completo}`}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full border-0 grayscale-[35%] transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
          </Rivela>
        </div>

        <Rivela direzione="sinistra" ritardo={0.1}>
          <div className="rounded-3xl vetro p-7 md:p-9">
            <h3 className="text-xl font-bold">Scrivici un messaggio</h3>
            <p className="mt-2 text-sm testo-tenue">
              Raccontaci il problema: ti rispondiamo con una prima valutazione, senza impegno.
            </p>
            <div className="mt-7">
              <ModuloContatti />
            </div>
          </div>
        </Rivela>
      </div>
    </Sezione>
  )
}
