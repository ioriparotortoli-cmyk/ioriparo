import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import { Lockup } from './Logo'
import { linkEmail, linkMappa, linkTelefono, linkWhatsapp, sito } from '@/lib/config/sito'
import { servizi } from '@/lib/dati/servizi'

const collegamenti = [
  { etichetta: 'Home', href: '/' },
  { etichetta: 'Servizi', href: '/#servizi' },
  { etichetta: 'Recensioni', href: '/#recensioni' },
  { etichetta: 'Contatti', href: '/#contatti' },
  { etichetta: 'Privacy Policy', href: '/privacy-policy' },
  { etichetta: 'Cookie Policy', href: '/cookie-policy' },
]

export function Footer() {
  const anno = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--bordo)] superficie-alt">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-elettrico-500/60 to-transparent" />

      <div className="contenitore grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Lockup />
          <p className="mt-5 max-w-xs text-sm leading-relaxed testo-tenue">
            Centro assistenza informatica a Tortolì: riparazioni rapide, ricambi di qualità e
            supporto professionale per privati e aziende in tutta l’Ogliastra.
          </p>
          <p className="mt-5 text-xs testo-tenue">P.IVA {sito.partitaIva}</p>
        </div>

        <nav aria-label="Collegamenti utili">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-elettrico-400">
            Collegamenti
          </h2>
          <ul className="mt-5 space-y-2.5">
            {collegamenti.map((voce) => (
              <li key={voce.href}>
                <Link
                  href={voce.href}
                  className="text-sm testo-tenue transition-colors hover:text-elettrico-400"
                >
                  {voce.etichetta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Servizi principali">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-elettrico-400">
            Servizi
          </h2>
          <ul className="mt-5 space-y-2.5">
            {servizi.slice(0, 8).map((servizio) => (
              <li key={servizio.slug}>
                <Link
                  href={`/#servizio-${servizio.slug}`}
                  className="text-sm testo-tenue transition-colors hover:text-elettrico-400"
                >
                  {servizio.titolo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-elettrico-400">
            Contatti
          </h2>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li>
              <a
                href={linkMappa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 testo-tenue transition-colors hover:text-elettrico-400"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-elettrico-500" aria-hidden="true" />
                <span>
                  {sito.indirizzo.via}
                  <br />
                  {sito.indirizzo.cap} {sito.indirizzo.citta} ({sito.indirizzo.provincia})
                </span>
              </a>
            </li>
            <li>
              <a
                href={linkTelefono}
                className="flex items-center gap-2.5 testo-tenue transition-colors hover:text-elettrico-400"
              >
                <Phone className="h-4 w-4 shrink-0 text-elettrico-500" aria-hidden="true" />
                {sito.contatti.telefonoVisibile}
              </a>
            </li>
            <li>
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 testo-tenue transition-colors hover:text-elettrico-400"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-elettrico-500" aria-hidden="true" />
                WhatsApp Business
              </a>
            </li>
            <li>
              <a
                href={linkEmail}
                className="flex items-center gap-2.5 testo-tenue transition-colors hover:text-elettrico-400"
              >
                <Mail className="h-4 w-4 shrink-0 text-elettrico-500" aria-hidden="true" />
                {sito.contatti.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5 testo-tenue">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-elettrico-500" aria-hidden="true" />
              <span>
                Lun–Ven 09:00–13:00 / 16:00–19:30
                <br />
                Sab 09:00–13:00
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--bordo)]">
        <div className="contenitore flex flex-col items-center justify-between gap-3 py-6 text-xs testo-tenue md:flex-row">
          <p>
            © {anno} {sito.nome}. Tutti i diritti riservati.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-elettrico-400">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-elettrico-400">
              Cookie
            </Link>
            <Link href="/admin" className="transition-colors hover:text-elettrico-400">
              Area riservata
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
