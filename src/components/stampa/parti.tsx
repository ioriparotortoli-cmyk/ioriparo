import type { ReactNode } from 'react'
import { ALTEZZA_MARCHIO, LARGHEZZA_MARCHIO, MARCHIO_STAMPA } from '@/lib/stampa/marchio'
import type { Azienda } from '@/types'

/** Elementi condivisi dai documenti stampabili. */

export function TestataDocumento({ azienda }: { azienda: Azienda }) {
  return (
    <header className="doc-testata">
      {/* Il marchio vero, non un disegno che gli somiglia. Porta gia' dentro
          il nome e il claim, quindi accanto non si ripetono a parole. */}
      <img
        className="doc-marchio"
        src={MARCHIO_STAMPA}
        width={LARGHEZZA_MARCHIO}
        height={ALTEZZA_MARCHIO}
        alt={`${azienda.nome} — ${azienda.claim}`}
      />

      <div className="doc-azienda">
        <strong>{azienda.indirizzo}</strong>
        <br />
        {azienda.citta}
        <br />
        Tel. {azienda.telefono}
        <br />
        {azienda.email}
        <br />
        P.IVA {azienda.partitaIva}
      </div>
    </header>
  )
}

export function PiedeDocumento({
  azienda,
  nota,
}: {
  azienda: Azienda
  nota?: string
}) {
  return (
    <footer className="doc-piede">
      <span>
        {azienda.nome} · {azienda.indirizzo}, {azienda.citta} · {azienda.telefono}
      </span>
      <span>{nota ?? `Documento generato il ${new Date().toLocaleDateString('it-IT')}`}</span>
    </footer>
  )
}

export function Sezione({ titolo, children }: { titolo: string; children: ReactNode }) {
  return (
    <section className="doc-sezione">
      <h2>{titolo}</h2>
      {children}
    </section>
  )
}

export function Campo({ etichetta, valore }: { etichetta: string; valore?: ReactNode }) {
  return (
    <div className="doc-campo">
      <span>{etichetta}</span>
      <span>{valore ?? '--'}</span>
    </div>
  )
}
