import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utili'
import { Icona, type NomeIcona } from './Icona'

/* ─────────────── Struttura ─────────────── */

export function Sezione({
  children,
  tinta,
  griglia,
  id,
  className,
}: {
  children: ReactNode
  /** Fondo alternativo per separare due blocchi consecutivi */
  tinta?: boolean
  /** Trama tecnica di sfondo */
  griglia?: boolean
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={cn('section', tinta && 'section--tint', className)}>
      {griglia && <div className="blueprint" aria-hidden="true" />}
      <div className="wrap">{children}</div>
    </section>
  )
}

export function Intestazione({
  occhiello,
  titolo,
  testo,
  children,
  principale,
}: {
  occhiello: string
  titolo: ReactNode
  testo?: ReactNode
  children?: ReactNode
  /** Titolo principale della pagina: viene reso come `h1`, uno solo per pagina. */
  principale?: boolean
}) {
  const Titolo = principale ? 'h1' : 'h2'
  return (
    <div className="section-head reveal">
      <span className="eyebrow">{occhiello}</span>
      <Titolo>{titolo}</Titolo>
      {testo && <p className="lede">{testo}</p>}
      {children}
    </div>
  )
}

/* ─────────────── Elementi ─────────────── */

export function Chip({
  children,
  variante,
  punto,
}: {
  children: ReactNode
  variante?: 'blue' | 'ok' | 'warn' | 'alert'
  punto?: boolean
}) {
  return (
    <span className={cn('chip', variante && `chip--${variante}`)}>
      {punto && <span className="dot" />}
      {children}
    </span>
  )
}

export function Ico({ nome }: { nome: NomeIcona }) {
  return (
    <span className="ico">
      <Icona nome={nome} dimensione={22} />
    </span>
  )
}

type VarianteBottone = 'pieno' | 'ghost' | 'soft' | 'danger'
const classeBottone = (v: VarianteBottone = 'pieno', piccolo?: boolean, largo?: boolean) =>
  cn('btn', v !== 'pieno' && `btn--${v}`, piccolo && 'btn--sm', largo && 'btn--wide')

export function Bottone({
  children,
  variante,
  piccolo,
  largo,
  ...resto
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBottone
  piccolo?: boolean
  largo?: boolean
}) {
  return (
    <button {...resto} className={cn(classeBottone(variante, piccolo, largo), resto.className)}>
      {children}
    </button>
  )
}

export function LinkBottone({
  a,
  children,
  variante,
  piccolo,
  largo,
  esterno,
  className,
  ...resto
}: {
  a: string
  children: ReactNode
  variante?: VarianteBottone
  piccolo?: boolean
  largo?: boolean
  esterno?: boolean
  className?: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classe = cn(classeBottone(variante, piccolo, largo), className)
  if (esterno || a.startsWith('http') || a.startsWith('tel:') || a.startsWith('mailto:')) {
    return (
      <a
        href={a}
        className={classe}
        {...(a.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...resto}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={a} className={classe}>
      {children}
    </Link>
  )
}

export function LinkTesto({ a, children }: { a: string; children: ReactNode }) {
  return (
    <Link to={a} className="link">
      {children}
      <Icona nome="arrow" dimensione={15} />
    </Link>
  )
}

/* ─────────────── Moduli ─────────────── */

export function Campo({
  etichetta,
  id,
  obbligatorio,
  errore,
  intero,
  aiuto,
  children,
}: {
  etichetta: string
  id: string
  obbligatorio?: boolean
  errore?: string
  /** Occupa tutta la larghezza nella griglia a due colonne */
  intero?: boolean
  aiuto?: string
  children: ReactNode
}) {
  return (
    <div className={cn('field', intero && 'field--full', errore && 'is-err')}>
      <label htmlFor={id}>
        {etichetta} {obbligatorio && <span>*</span>}
      </label>
      {children}
      {aiuto && !errore && <small className="faint" style={{ fontSize: '.76rem' }}>{aiuto}</small>}
      {errore && <small className="field__err">{errore}</small>}
    </div>
  )
}

export function Avviso({
  variante = 'ok',
  visibile,
  children,
}: {
  variante?: 'ok' | 'info' | 'err'
  visibile: boolean
  children: ReactNode
}) {
  if (!visibile) return null
  return (
    <div className={cn('notice', `notice--${variante}`, 'is-on')} role="status">
      {variante === 'ok' && <Icona nome="check" dimensione={18} />}
      <span>{children}</span>
    </div>
  )
}

export function Selettore<T extends string>({
  voci,
  attiva,
  onCambia,
  etichetta,
}: {
  voci: { id: T; etichetta: string }[]
  attiva: T
  onCambia: (id: T) => void
  etichetta: string
}) {
  return (
    <div className="switch" role="tablist" aria-label={etichetta}>
      {voci.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={v.id === attiva}
          className={cn(v.id === attiva && 'is-on')}
          onClick={() => onCambia(v.id)}
        >
          {v.etichetta}
        </button>
      ))}
    </div>
  )
}

export function Tabella({ colonne, children }: { colonne: { testo: string; num?: boolean }[]; children: ReactNode }) {
  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            {colonne.map((c) => (
              <th key={c.testo} className={c.num ? 'num' : undefined}>
                {c.testo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
