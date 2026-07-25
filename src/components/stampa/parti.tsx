import type { ReactNode } from 'react'
import type { Azienda } from '@/types'

/** Elementi condivisi dai documenti stampabili. */

export function TestataDocumento({ azienda }: { azienda: Azienda }) {
  return (
    <header className="doc-testata">
      <div className="doc-marchio">
        <svg viewBox="0 0 40 40" role="img" aria-label={azienda.nome}>
          <rect x="10" y="4" width="17" height="30" rx="3.5" fill="#2563eb" />
          <rect x="12.4" y="7.5" width="12.2" height="20" rx="1.6" fill="#fff" />
          <circle cx="18.5" cy="31" r="1.5" fill="#fff" />
          <path
            d="M25 13.5l4.2-4.2a4.3 4.3 0 015.8 5.8l-4.2 4.2"
            stroke="#14181f"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div>
          <div className="doc-marchio-nome">{azienda.nome}</div>
          <div className="doc-marchio-claim">{azienda.claim}</div>
        </div>
      </div>

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
