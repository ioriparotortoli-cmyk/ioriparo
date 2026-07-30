import type { ReactNode } from 'react'
import type { Azienda } from '@/types'

/** Elementi condivisi dai documenti stampabili. */

export function TestataDocumento({ azienda }: { azienda: Azienda }) {
  return (
    <header className="doc-testata">
      {/* Il marchio arriva dalle impostazioni dell'attivita', incorporato nel
          documento perche' questo si puo' scaricare e stampare da disco, dove
          un collegamento al sito non risolve. Senza marchio caricato resta il
          nome scritto: meglio di un'intestazione presa in prestito. */}
      {azienda.logo ? (
        <img className="doc-marchio" src={azienda.logo} alt={azienda.nome} />
      ) : (
        <div className="doc-marchio-testo">
          <div className="doc-marchio-nome">{azienda.nome}</div>
          <div className="doc-marchio-claim">{azienda.claim}</div>
        </div>
      )}

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
