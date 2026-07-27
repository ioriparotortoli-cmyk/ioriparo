import { Link } from 'react-router-dom'
import { AZIENDA } from '../dati/azienda'

/**
 * Marchio Io Riparo in versione vettoriale: smartphone, notebook e i due
 * attrezzi incrociati, con il gradiente istituzionale (#29ABE2 → #0071BC).
 * Lo schermo del notebook usa il colore di fondo della pagina, così il segno
 * resta leggibile sia su tema chiaro sia su tema scuro.
 */
export function Simbolo({
  dimensione = 38,
  className,
  fondo = 'var(--ground)',
}: {
  dimensione?: number
  className?: string
  /** Colore dello schermo del notebook: va abbinato allo sfondo su cui poggia. */
  fondo?: string
}) {
  return (
    <svg
      viewBox="0 0 134 130"
      height={dimensione}
      width={(dimensione * 134) / 130}
      className={className}
      role="img"
      aria-label={AZIENDA.nome}
    >
      <defs>
        <linearGradient id="ir-blu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#29abe2" />
          <stop offset="1" stopColor="#0071bc" />
        </linearGradient>
        <mask id="ir-ganascia">
          <rect x="-40" y="-40" width="80" height="80" fill="#fff" />
          <circle cx="0" cy="0" r="7.4" fill="#000" />
          <path d="M4 -13.5h14v27H4z" fill="#000" />
        </mask>
      </defs>
      <g fill="url(#ir-blu)">
        <path d="M14 0h25a14 14 0 0 1 14 14v102a14 14 0 0 1-14 14H14A14 14 0 0 1 0 116V14A14 14 0 0 1 14 0zm0 8a6 6 0 0 0-6 6v102a6 6 0 0 0 6 6h25a6 6 0 0 0 6-6V14a6 6 0 0 0-6-6z" />
        <rect x="16" y="12" width="21" height="4" rx="2" />
        <circle cx="26.5" cy="115" r="4.6" />
        <rect x="20" y="26" width="106" height="80" rx="8" fill={fondo} />
        <path d="M28 26h90a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8zm0 8a1 1 0 0 0-1 1v62a1 1 0 0 0 1 1h90a1 1 0 0 0 1-1V35a1 1 0 0 0-1-1z" />
        <path d="M16 108h114a4 4 0 0 1 3.8 5.2l-2.4 8A6 6 0 0 1 125.7 125H20.3a6 6 0 0 1-5.7-4l-2.4-8A4 4 0 0 1 16 108zm42 3.5c0 2 1.6 3.5 3.5 3.5h23c1.9 0 3.5-1.6 3.5-3.5z" />
        <g transform="translate(73 66)">
          <g transform="rotate(45)">
            <rect x="4" y="-7" width="30" height="14" rx="6" />
            <rect x="-4" y="-4" width="10" height="8" rx="2" />
            <rect x="-26" y="-2.6" width="23" height="5.2" rx="1.4" />
            <path d="M-36 -3.4l10-.6v8l-10-.6z" />
          </g>
          <g transform="rotate(-45)">
            <rect x="-34" y="-5.4" width="46" height="10.8" rx="5.4" />
            <circle cx="20" cy="0" r="13.6" mask="url(#ir-ganascia)" />
          </g>
        </g>
      </g>
    </svg>
  )
}

/** Marchio completo con lettering, usato in intestazione e piè di pagina. */
export function Marchio({ compatto, className }: { compatto?: boolean; className?: string }) {
  return (
    <Link to="/" className={`brand ${className ?? ''}`} aria-label={`${AZIENDA.nome} — home`}>
      <Simbolo dimensione={compatto ? 32 : 38} className="brand__mark" />
      <span className="brand__txt">
        <span className="brand__name">IO RIPARO</span>
        <span className="brand__claim">{AZIENDA.claim}</span>
      </span>
    </Link>
  )
}
