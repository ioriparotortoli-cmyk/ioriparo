import type { Metadata } from 'next'
import Link from 'next/link'
import { PaginaTesto } from '@/components/ui/PaginaTesto'
import { sito } from '@/lib/config/sito'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Informativa sul trattamento dei dati personali di Io Riparo ai sensi del Regolamento UE 2016/679 (GDPR).',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
}

export default function PaginaPrivacy() {
  return (
    <PaginaTesto titolo="Privacy Policy" aggiornamento="26 luglio 2026">
      <p>
        La presente informativa descrive come {sito.nome} tratta i dati personali degli utenti che
        visitano questo sito e di chi ci contatta per richiedere assistenza, ai sensi degli articoli
        13 e 14 del Regolamento UE 2016/679 (GDPR).
      </p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        {sito.nome} — {sito.indirizzo.completo} — P.IVA {sito.partitaIva}.
        <br />
        Email: <a href={`mailto:${sito.contatti.email}`}>{sito.contatti.email}</a> · Telefono:{' '}
        <a href={`tel:${sito.contatti.telefono}`}>{sito.contatti.telefonoVisibile}</a>
      </p>

      <h2>2. Quali dati raccogliamo</h2>
      <ul>
        <li>
          <strong>Dati di contatto</strong>: nome, cognome, telefono, indirizzo email, forniti
          compilando i moduli di contatto, preventivo o prenotazione.
        </li>
        <li>
          <strong>Dati sul dispositivo da riparare</strong>: marca, modello, descrizione del guasto e
          fotografie che scegli di allegare.
        </li>
        <li>
          <strong>Dati tecnici di navigazione</strong>: indirizzo IP, tipo di browser e pagine
          visitate, trattati in forma aggregata per sicurezza e statistiche.
        </li>
      </ul>
      <p>
        Non chiediamo né trattiamo consapevolmente categorie particolari di dati (art. 9 GDPR). Ti
        invitiamo a non inserire nei moduli informazioni sensibili non necessarie alla riparazione.
      </p>

      <h2>3. Finalità e base giuridica</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[color:var(--bordo)]">
            <th scope="col">Finalità</th>
            <th scope="col">Base giuridica</th>
          </tr>
        </thead>
        <tbody className="testo-tenue">
          <tr className="border-b border-[color:var(--bordo)]">
            <td>Rispondere a richieste di preventivo, contatto e prenotazione</td>
            <td>Misure precontrattuali su richiesta dell’interessato (art. 6.1.b)</td>
          </tr>
          <tr className="border-b border-[color:var(--bordo)]">
            <td>Eseguire il servizio di riparazione e la relativa garanzia</td>
            <td>Esecuzione del contratto (art. 6.1.b)</td>
          </tr>
          <tr className="border-b border-[color:var(--bordo)]">
            <td>Adempimenti fiscali e contabili</td>
            <td>Obbligo di legge (art. 6.1.c)</td>
          </tr>
          <tr>
            <td>Sicurezza del sito e prevenzione degli abusi</td>
            <td>Legittimo interesse del titolare (art. 6.1.f)</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Dati contenuti nei dispositivi</h2>
      <p>
        Durante la riparazione i tecnici possono accedere al dispositivo per verificarne il
        funzionamento. Non consultiamo, copiamo né conserviamo i contenuti personali (foto,
        messaggi, documenti) salvo che sia strettamente necessario all’intervento richiesto — ad
        esempio nel recupero dati o nel trasferimento su un nuovo supporto — e comunque previa tua
        autorizzazione. I dati eventualmente copiati per il backup vengono cancellati entro 30 giorni
        dalla riconsegna.
      </p>

      <h2>5. Destinatari</h2>
      <p>
        I dati possono essere trattati da personale autorizzato e da fornitori che agiscono come
        responsabili del trattamento (art. 28 GDPR): fornitore di hosting e database, servizio di
        invio email transazionali, servizi Google per mappe e recensioni. Non vendiamo né cediamo i
        dati a terzi per finalità di marketing.
      </p>

      <h2>6. Trasferimenti extra UE</h2>
      <p>
        Alcuni fornitori possono trattare dati al di fuori dello Spazio Economico Europeo. In tal
        caso il trasferimento avviene sulla base di decisioni di adeguatezza della Commissione
        europea o di clausole contrattuali standard.
      </p>

      <h2>7. Conservazione</h2>
      <ul>
        <li>Richieste di preventivo e messaggi non seguiti da incarico: 12 mesi.</li>
        <li>Dati relativi a riparazioni eseguite: 24 mesi dalla consegna (durata della garanzia).</li>
        <li>Documenti fiscali: 10 anni, come previsto dalla normativa.</li>
      </ul>

      <h2>8. I tuoi diritti</h2>
      <p>
        Puoi esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione,
        limitazione, portabilità e opposizione (artt. 15–22 GDPR) scrivendo a{' '}
        <a href={`mailto:${sito.contatti.email}`}>{sito.contatti.email}</a>. Hai inoltre diritto di
        proporre reclamo al Garante per la protezione dei dati personali (
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
          garanteprivacy.it
        </a>
        ).
      </p>

      <h2>9. Cookie</h2>
      <p>
        L’uso dei cookie e delle tecnologie analoghe è descritto nella{' '}
        <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>
    </PaginaTesto>
  )
}
