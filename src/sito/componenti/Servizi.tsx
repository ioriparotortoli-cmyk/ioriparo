import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FAMIGLIE, SERVIZI, type FamigliaServizio, type Servizio } from '../dati/servizi'
import { Icona } from './Icona'
import { Illustrazione } from './Illustrazione'
import { Selettore } from './base'

export function SchedaServizio({ servizio }: { servizio: Servizio }) {
  return (
    <Link className="svc" to={`/preventivo?servizio=${servizio.id}`}>
      <Illustrazione scena={servizio.scena} className="svc__art" />
      <span className="ico">
        <Icona nome={servizio.icona} dimensione={22} />
      </span>
      <h3>{servizio.titolo}</h3>
      <p>{servizio.descrizione}</p>
      <div className="svc__tags">
        {servizio.tag.map((t) => (
          <i key={t}>{t}</i>
        ))}
      </div>
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginTop: 8, paddingTop: 14, borderTop: '1px solid var(--line)' }}
      >
        <span className="svc__price">
          Prezzi <b>{servizio.prezzo}</b>
        </span>
        <span className="svc__price row" style={{ gap: 5 }}>
          <Icona nome="clock" dimensione={13} /> {servizio.tempo}
        </span>
      </div>
      <span className="svc__more">
        Richiedi preventivo <Icona nome="arrow" dimensione={15} />
      </span>
    </Link>
  )
}

/** Griglia dei servizi con filtro per famiglia. */
export function GrigliaServizi({ filtrabile = true }: { filtrabile?: boolean }) {
  const [famiglia, setFamiglia] = useState<FamigliaServizio | 'tutti'>('tutti')
  const visibili = famiglia === 'tutti' ? SERVIZI : SERVIZI.filter((s) => s.famiglia === famiglia)

  return (
    <>
      {filtrabile && (
        <Selettore voci={FAMIGLIE} attiva={famiglia} onCambia={setFamiglia} etichetta="Filtra i servizi" />
      )}
      <div className="svc-grid" style={{ marginTop: filtrabile ? 26 : 0 }}>
        {visibili.map((s) => (
          <SchedaServizio key={s.id} servizio={s} />
        ))}
      </div>
    </>
  )
}
