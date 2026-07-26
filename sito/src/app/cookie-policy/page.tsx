import type { Metadata } from 'next'
import Link from 'next/link'
import { PaginaTesto } from '@/components/ui/PaginaTesto'
import { sito } from '@/lib/config/sito'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Informativa sui cookie e sulle tecnologie di memorizzazione usate dal sito di Io Riparo.',
  alternates: { canonical: '/cookie-policy' },
}

export default function PaginaCookie() {
  return (
    <PaginaTesto titolo="Cookie Policy" aggiornamento="26 luglio 2026">
      <p>
        Questo sito è stato progettato per funzionare con il minor numero possibile di cookie: non
        utilizziamo cookie di profilazione né strumenti pubblicitari di terze parti.
      </p>

      <h2>1. Cosa sono i cookie</h2>
      <p>
        I cookie sono piccoli file di testo che i siti salvano sul dispositivo dell’utente. Insieme a
        tecnologie simili (come il <em>localStorage</em>) permettono di ricordare preferenze e di far
        funzionare correttamente alcune funzioni.
      </p>

      <h2>2. Cosa usiamo</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[color:var(--bordo)]">
            <th scope="col">Nome</th>
            <th scope="col">Tipo</th>
            <th scope="col">Finalità</th>
            <th scope="col">Durata</th>
          </tr>
        </thead>
        <tbody className="testo-tenue">
          <tr className="border-b border-[color:var(--bordo)]">
            <td>ioriparo-tema</td>
            <td>localStorage tecnico</td>
            <td>Ricorda la scelta tra tema chiaro e scuro</td>
            <td>Fino a cancellazione</td>
          </tr>
          <tr className="border-b border-[color:var(--bordo)]">
            <td>sb-*-auth-token</td>
            <td>Cookie tecnico</td>
            <td>Sessione di accesso all’area riservata (solo per lo staff)</td>
            <td>Sessione / 7 giorni</td>
          </tr>
          <tr>
            <td>Google Maps</td>
            <td>Terza parte</td>
            <td>Visualizzazione della mappa nella sezione contatti</td>
            <td>Definita da Google</td>
          </tr>
        </tbody>
      </table>
      <p>
        I cookie tecnici non richiedono consenso preventivo (art. 122 del Codice Privacy e linee
        guida del Garante dell’10 giugno 2021). La mappa viene caricata solo quando la sezione
        contatti entra nel viewport: se non la visualizzi, Google non riceve alcun dato dal tuo
        browser attraverso questo sito.
      </p>

      <h2>3. Come disattivarli</h2>
      <p>
        Puoi bloccare o cancellare i cookie dalle impostazioni del tuo browser (sezione “Privacy” o
        “Dati dei siti”). La disattivazione dei cookie tecnici può impedire il corretto
        funzionamento di alcune parti del sito, come il salvataggio del tema o l’accesso all’area
        riservata.
      </p>

      <h2>4. Contatti</h2>
      <p>
        Per qualsiasi chiarimento scrivi a{' '}
        <a href={`mailto:${sito.contatti.email}`}>{sito.contatti.email}</a>. Il trattamento dei dati
        personali è descritto nella <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </PaginaTesto>
  )
}
