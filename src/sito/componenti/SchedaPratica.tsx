import type { Riparazione, StatoRiparazione, TipoDispositivo } from '@/types'
import { totaleRiparazione } from '@/lib/calcoli'
import { formatData } from '@/lib/format'
import { euro } from '../lib/utili'
import { Icona, type NomeIcona } from './Icona'
import { Chip } from './base'

const ICONA_DISPOSITIVO: Record<TipoDispositivo, NomeIcona> = {
  smartphone: 'phone',
  tablet: 'tablet',
  notebook: 'laptop',
  desktop: 'desktop',
  console: 'box',
  smartwatch: 'clock',
  altro: 'tool',
}

interface Tappa {
  titolo: string
  nota: string
  quando: string
  stato: 'fatto' | 'corrente' | 'attesa'
}

/** Posizione dello stato interno del gestionale sulla linea mostrata al cliente. */
const AVANZAMENTO: Record<StatoRiparazione, number> = {
  in_attesa: 0,
  preventivo_inviato: 1,
  in_lavorazione: 2,
  pronto_per_ritiro: 4,
  consegnato: 5,
  non_riparabile: 3,
}

export function tappeRiparazione(r: Riparazione): Tappa[] {
  const passo = AVANZAMENTO[r.stato]
  const definizione: { titolo: string; nota: string; quando?: string }[] = [
    {
      titolo: 'Accettazione',
      nota: `Dispositivo preso in carico${r.tecnico ? `, tecnico ${r.tecnico}` : ''}`,
      quando: formatData(r.dataAccettazione),
    },
    {
      titolo: 'Diagnosi e preventivo',
      nota:
        r.stato === 'preventivo_inviato'
          ? 'Preventivo inviato: attendiamo la tua conferma'
          : 'Guasto individuato e costo comunicato',
    },
    { titolo: 'Riparazione in corso', nota: r.difettoSegnalato },
    {
      titolo: 'Collaudo finale',
      nota: r.stato === 'non_riparabile' ? 'Intervento non risolutivo: dispositivo non riparabile' : 'Verifica su 18 punti di controllo',
    },
    {
      titolo: 'Pronto al ritiro',
      nota: 'Ti avvisiamo via e-mail e WhatsApp',
      quando: r.consegnaPrevista ? formatData(r.consegnaPrevista) : undefined,
    },
    { titolo: 'Consegnato', nota: 'Garanzia attiva da oggi', quando: r.dataConsegna ? formatData(r.dataConsegna) : undefined },
  ]

  return definizione.map((d, i) => ({
    titolo: d.titolo,
    nota: d.nota,
    quando: d.quando ?? (i < passo ? '✓' : '—'),
    stato: i < passo ? 'fatto' : i === passo ? 'corrente' : 'attesa',
  }))
}

const ETICHETTA: Record<StatoRiparazione, { testo: string; variante: 'blue' | 'ok' | 'warn' | 'alert' }> = {
  in_attesa: { testo: 'In diagnosi', variante: 'blue' },
  preventivo_inviato: { testo: 'Preventivo da approvare', variante: 'warn' },
  in_lavorazione: { testo: 'In lavorazione', variante: 'warn' },
  pronto_per_ritiro: { testo: 'Pronto al ritiro', variante: 'ok' },
  consegnato: { testo: 'Consegnata', variante: 'ok' },
  non_riparabile: { testo: 'Non riparabile', variante: 'alert' },
}

/**
 * Scheda pubblica di una riparazione: è la stessa pratica del gestionale,
 * mostrata al cliente con lo stato di avanzamento e il totale.
 */
export function SchedaPratica({
  riparazione,
  azioni,
  vetro,
  senzaImporti,
}: {
  riparazione: Riparazione
  azioni?: React.ReactNode
  /** Versione in vetro usata nella sezione di apertura */
  vetro?: boolean
  /**
   * Nasconde il totale. Serve alla ricerca pubblica per codice, dove il
   * database non espone gli importi: mostrare "€ 0,00" sarebbe peggio che
   * non mostrare nulla.
   */
  senzaImporti?: boolean
}) {
  const stato = ETICHETTA[riparazione.stato]
  const totale = totaleRiparazione(riparazione)

  return (
    <div className={vetro ? 'ticket' : 'card'}>
      <div className="ticket__top">
        <span className="ticket__code mono">PRATICA {riparazione.codice}</span>
        <Chip variante={stato.variante} punto>
          {stato.testo}
        </Chip>
      </div>

      <div className="ticket__device">
        <span className="ico">
          <Icona nome={ICONA_DISPOSITIVO[riparazione.tipoDispositivo]} dimensione={22} />
        </span>
        <span>
          <b>
            {riparazione.marca} {riparazione.modello}
            {riparazione.capacita ? ` · ${riparazione.capacita}` : ''}
          </b>
          <span>{riparazione.difettoSegnalato}</span>
        </span>
      </div>

      <div className="steps">
        {tappeRiparazione(riparazione).map((t) => (
          <div
            className={`step${t.stato === 'fatto' ? ' is-done' : t.stato === 'corrente' ? ' is-live' : ''}`}
            key={t.titolo}
          >
            <span className="step__bullet">
              <i />
            </span>
            <span>
              <b>{t.titolo}</b>
              <small>{t.nota}</small>
            </span>
            <time>{t.quando}</time>
          </div>
        ))}
      </div>

      <div className="ticket__foot">
        <div>
          {senzaImporti ? (
            <>
              <div className="faint" style={{ fontSize: '.75rem' }}>
                Garanzia
              </div>
              <b style={{ fontSize: '.9rem' }}>12 mesi</b>
            </>
          ) : (
            <>
              <div className="faint" style={{ fontSize: '.75rem' }}>
                {riparazione.acconto ? 'Saldo da versare' : 'Totale'}
              </div>
              <div className="ticket__price">
                {euro(riparazione.acconto ? totale - riparazione.acconto : totale)}
              </div>
            </>
          )}
        </div>
        {azioni ?? (
          <div style={{ textAlign: 'right' }}>
            <div className="faint" style={{ fontSize: '.75rem' }}>
              Consegna prevista
            </div>
            <b style={{ fontSize: '.9rem' }}>
              {riparazione.consegnaPrevista ? formatData(riparazione.consegnaPrevista) : 'da definire'}
            </b>
          </div>
        )}
      </div>
    </div>
  )
}
