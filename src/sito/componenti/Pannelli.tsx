import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AZIENDA } from '../dati/azienda'
import { cerca } from '../dati/indice'
import { useEsc } from '../lib/hook'
import { cn } from '../lib/utili'
import { BottoneChiama } from './Contatto'
import { Icona } from './Icona'
import { LinkBottone } from './base'

/* ─────────────── Menu a scomparsa ─────────────── */

const VOCI_MENU = [
  { etichetta: 'Home', percorso: '/' },
  { etichetta: 'Chi siamo', percorso: '/chi-siamo' },
  { etichetta: 'Servizi', percorso: '/servizi', nota: '12 specializzazioni' },
  { etichetta: 'Galleria', percorso: '/galleria' },
  { etichetta: 'Stato riparazione', percorso: '/stato-riparazione', nota: 'codice pratica' },
  { etichetta: 'Preventivo online', percorso: '/preventivo' },
  { etichetta: 'Prenota appuntamento', percorso: '/prenota' },
  { etichetta: 'Blog', percorso: '/blog' },
  { etichetta: 'Contatti', percorso: '/contatti' },
  { etichetta: 'Area clienti', percorso: '/area-clienti' },
]

export function MenuMobile({ aperto, onChiudi }: { aperto: boolean; onChiudi: () => void }) {
  const primo = useRef<HTMLAnchorElement>(null)

  useEsc(aperto, onChiudi)
  useEffect(() => {
    if (aperto) primo.current?.focus({ preventScroll: true })
  }, [aperto])

  return (
    <nav className={cn('menu', aperto && 'is-on')} aria-label="Menu di navigazione" aria-hidden={!aperto}>
      <div className="menu__top">
        <span className="eyebrow">Menu</span>
        <button className="iconbtn" onClick={onChiudi} aria-label="Chiudi il menu">
          <Icona nome="x" />
        </button>
      </div>

      {VOCI_MENU.map((v, i) => (
        <Link key={v.percorso} to={v.percorso} onClick={onChiudi} ref={i === 0 ? primo : undefined}>
          {v.etichetta}
          {v.nota && <small>{v.nota}</small>}
        </Link>
      ))}

      <div className="menu__cta">
        <LinkBottone a="/preventivo" largo>
          Richiedi preventivo
        </LinkBottone>
        <BottoneChiama largo>Chiama {AZIENDA.telefono}</BottoneChiama>
      </div>
    </nav>
  )
}

/* ─────────────── Ricerca interna ─────────────── */

export function Ricerca({ aperta, onChiudi }: { aperta: boolean; onChiudi: () => void }) {
  const [query, setQuery] = useState('')
  const campo = useRef<HTMLInputElement>(null)
  const risultati = useMemo(() => cerca(query), [query])

  useEsc(aperta, onChiudi)
  useEffect(() => {
    if (aperta) {
      setQuery('')
      setTimeout(() => campo.current?.focus(), 60)
    }
  }, [aperta])

  return (
    <div className={cn('search', aperta && 'is-on')} role="dialog" aria-modal="true" aria-label="Ricerca nel sito">
      <div className="search__in">
        <Icona nome="search" dimensione={19} />
        <input
          ref={campo}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca servizi, guide, pagine…"
          aria-label="Cerca nel sito"
          autoComplete="off"
        />
        <kbd>ESC</kbd>
      </div>
      <div className="search__res">
        {risultati.length ? (
          risultati.map((r) => (
            <Link key={r.percorso + r.titolo} to={r.percorso} onClick={onChiudi}>
              <span className="ico" style={{ width: 34, height: 34, borderRadius: 10 }}>
                <Icona nome={r.icona} dimensione={16} />
              </span>
              <span>
                <b>{r.titolo}</b>
                <span>{r.nota}</span>
              </span>
            </Link>
          ))
        ) : (
          <div className="search__empty">
            Nessun risultato per “{query}”.
            <br />
            Prova con “display”, “wifi” o “recupero dati”.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────── Banner cookie ─────────────── */

export type Consenso = 'tutti' | 'necessari' | string

export function BannerCookie({
  visibile,
  onSalva,
  apertoDaPreferenze,
}: {
  visibile: boolean
  onSalva: (scelta: Consenso) => void
  apertoDaPreferenze: boolean
}) {
  const [dettagli, setDettagli] = useState(false)
  const [statistici, setStatistici] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (apertoDaPreferenze) setDettagli(true)
  }, [apertoDaPreferenze])

  const salvaScelta = () => {
    const scelte = [statistici && 'statistici', marketing && 'marketing'].filter(Boolean)
    onSalva(scelte.length ? scelte.join('+') : 'necessari')
  }

  return (
    <div
      className={cn('cookie', visibile && 'is-on', dettagli && 'show-prefs')}
      role="dialog"
      aria-live="polite"
      aria-label="Preferenze cookie"
    >
      <div className="row" style={{ gap: 10 }}>
        <span className="ico" style={{ width: 34, height: 34, borderRadius: 10 }}>
          <Icona nome="shield" dimensione={17} />
        </span>
        <b style={{ fontSize: '.95rem' }}>Rispettiamo la tua privacy</b>
      </div>
      <p>
        Usiamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie statistici e di
        marketing. Puoi cambiare idea quando vuoi dal piè di pagina.
      </p>

      <div className="cookie__prefs">
        <label className="toggle">
          <span>
            <b>Necessari</b>
            <br />
            <span className="faint" style={{ fontSize: '.78rem' }}>
              Sessione, tema, sicurezza
            </span>
          </span>
          <input type="checkbox" checked disabled readOnly />
        </label>
        <label className="toggle">
          <span>
            <b>Statistici</b>
            <br />
            <span className="faint" style={{ fontSize: '.78rem' }}>
              Analisi anonima delle visite
            </span>
          </span>
          <input type="checkbox" checked={statistici} onChange={(e) => setStatistici(e.target.checked)} />
        </label>
        <label className="toggle">
          <span>
            <b>Marketing</b>
            <br />
            <span className="faint" style={{ fontSize: '.78rem' }}>
              Misurazione delle campagne
            </span>
          </span>
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
        </label>
      </div>

      <div className="cookie__btns">
        <button className="btn btn--sm" onClick={() => onSalva('tutti')}>
          Accetta tutti
        </button>
        <button className="btn btn--sm btn--ghost" onClick={() => onSalva('necessari')}>
          Solo necessari
        </button>
        <button className="btn btn--sm btn--soft" onClick={() => (dettagli ? salvaScelta() : setDettagli(true))}>
          {dettagli ? 'Salva le scelte' : 'Personalizza'}
        </button>
        <Link className="link" to="/cookie-policy" style={{ fontSize: '.8rem', marginLeft: 'auto', alignSelf: 'center' }}>
          Cookie policy
        </Link>
      </div>
    </div>
  )
}
