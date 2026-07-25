import { totaleFattura, totaleRighe } from '@/lib/calcoli'
import { oggiISO } from '@/lib/format'
import { ORDINE_STATI, STATI_APERTI, STATI_RIPARAZIONE } from '@/lib/stati'
import type { DatabaseGestionale, StatoRiparazione } from '@/types'

/** Aggregazioni derivate mostrate su dashboard e statistiche. */

export interface VoceStato {
  stato: StatoRiparazione
  label: string
  colore: string
  valore: number
}

export function contaPerStato(db: DatabaseGestionale): Record<StatoRiparazione, number> {
  const conteggi = Object.fromEntries(ORDINE_STATI.map((s) => [s, 0])) as Record<
    StatoRiparazione,
    number
  >
  for (const riparazione of db.riparazioni) conteggi[riparazione.stato] += 1
  return conteggi
}

/** Voci della ciambella «Riparazioni per stato» (solo lavorazioni aperte). */
export function riparazioniPerStato(db: DatabaseGestionale): VoceStato[] {
  const conteggi = contaPerStato(db)
  const oggi = oggiISO()
  const consegnateOggi = db.riparazioni.filter(
    (r) => r.stato === 'consegnato' && r.dataConsegna === oggi,
  ).length

  return ORDINE_STATI.map((stato) => ({
    stato,
    label: stato === 'consegnato' ? 'Consegnato oggi' : STATI_RIPARAZIONE[stato].label,
    colore: STATI_RIPARAZIONE[stato].colore,
    valore: stato === 'consegnato' ? consegnateOggi : conteggi[stato],
  }))
}

export function riparazioniAperte(db: DatabaseGestionale): number {
  return db.riparazioni.filter((r) => STATI_APERTI.includes(r.stato)).length
}

export function riparazioniConsegnateOggi(db: DatabaseGestionale): number {
  const oggi = oggiISO()
  return db.riparazioni.filter((r) => r.dataConsegna === oggi).length
}

export function incassoDelGiorno(db: DatabaseGestionale, giorno = oggiISO()): number {
  return db.fatture
    .filter((f) => f.stato === 'pagata' && f.dataPagamento === giorno)
    .reduce((somma, f) => somma + totaleFattura(f), 0)
}

/** Incasso del mese solare a cui appartiene `riferimento`. */
export function incassoDelMese(db: DatabaseGestionale, riferimento = oggiISO()): number {
  const mese = riferimento.slice(0, 7)
  return db.fatture
    .filter((f) => f.stato === 'pagata' && f.dataPagamento?.startsWith(mese))
    .reduce((somma, f) => somma + totaleFattura(f), 0)
}

export interface PuntoIncasso {
  giorno: string
  etichetta: string
  incasso: number
}

/**
 * Serie per il grafico «Andamento incassi».
 * `mese` → tutti i giorni del mese corrente; `30g` → ultimi 30 giorni.
 */
export function andamentoIncassi(
  db: DatabaseGestionale,
  periodo: 'mese' | '30g' | '7g' = 'mese',
): PuntoIncasso[] {
  const oggi = new Date(`${oggiISO()}T00:00:00`)
  const giorni: string[] = []

  if (periodo === 'mese') {
    // Ci si ferma a oggi: i giorni futuri appiattirebbero la curva sullo zero.
    const ultimoGiorno = oggi.getDate()
    for (let g = 1; g <= ultimoGiorno; g++) {
      giorni.push(
        `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).padStart(2, '0')}-${String(g).padStart(2, '0')}`,
      )
    }
  } else {
    const quanti = periodo === '30g' ? 30 : 7
    for (let g = quanti - 1; g >= 0; g--) {
      const data = new Date(oggi.getTime() - g * 86_400_000)
      giorni.push(data.toISOString().slice(0, 10))
    }
  }

  const perGiorno = new Map<string, number>()
  for (const fattura of db.fatture) {
    if (fattura.stato !== 'pagata' || !fattura.dataPagamento) continue
    perGiorno.set(
      fattura.dataPagamento,
      (perGiorno.get(fattura.dataPagamento) ?? 0) + totaleFattura(fattura),
    )
  }

  return giorni.map((giorno) => ({
    giorno,
    etichetta: giorno.slice(8),
    incasso: Math.round(perGiorno.get(giorno) ?? 0),
  }))
}

export interface ProdottoVenduto {
  articoloId?: string
  nome: string
  pezzi: number
  ricavo: number
}

/** Classifica dei prodotti/servizi più venduti nel periodo indicato (in giorni). */
export function prodottiPiuVenduti(
  db: DatabaseGestionale,
  giorni = 30,
  limite = 5,
): ProdottoVenduto[] {
  const inizio = new Date(new Date(`${oggiISO()}T00:00:00`).getTime() - giorni * 86_400_000)
    .toISOString()
    .slice(0, 10)

  const aggregato = new Map<string, ProdottoVenduto>()

  for (const fattura of db.fatture) {
    if (fattura.data < inizio) continue
    for (const riga of fattura.righe) {
      const articolo = riga.articoloId
        ? db.magazzino.find((a) => a.id === riga.articoloId)
        : undefined
      const chiave = riga.articoloId ?? riga.descrizione
      const nome = articolo?.nome ?? riga.descrizione
      const voce = aggregato.get(chiave) ?? {
        articoloId: riga.articoloId,
        nome,
        pezzi: 0,
        ricavo: 0,
      }
      voce.pezzi += riga.quantita
      voce.ricavo += riga.quantita * riga.prezzoUnitario
      aggregato.set(chiave, voce)
    }
  }

  return [...aggregato.values()].sort((a, b) => b.pezzi - a.pezzi).slice(0, limite)
}

/** Articoli sotto la scorta minima, i più critici per primi. */
export function articoliSottoScorta(db: DatabaseGestionale) {
  return db.magazzino
    .filter((a) => a.quantita <= a.scorta_minima)
    .sort((a, b) => a.quantita - a.scorta_minima - (b.quantita - b.scorta_minima))
}

/** Scadenze aperte ordinate per data, le più imminenti per prime. */
export function scadenzeImminenti(db: DatabaseGestionale, limite = 3) {
  return db.scadenze
    .filter((s) => !s.completata)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, limite)
}

/** Ultime riparazioni accettate, dalla più recente. */
export function ultimeRiparazioni(db: DatabaseGestionale, limite = 5) {
  return [...db.riparazioni]
    .sort((a, b) => b.dataAccettazione.localeCompare(a.dataAccettazione) || b.codice.localeCompare(a.codice))
    .slice(0, limite)
}

export function totaleDaIncassare(db: DatabaseGestionale): number {
  return db.fatture
    .filter((f) => f.stato === 'emessa' || f.stato === 'scaduta')
    .reduce((somma, f) => somma + totaleFattura(f), 0)
}

export function valoreMagazzino(db: DatabaseGestionale): number {
  return db.magazzino.reduce((somma, a) => somma + a.quantita * a.prezzoAcquisto, 0)
}

/** Ricavi per categoria merceologica nel periodo indicato. */
export function ricaviPerCategoria(db: DatabaseGestionale, giorni = 30) {
  const inizio = new Date(new Date(`${oggiISO()}T00:00:00`).getTime() - giorni * 86_400_000)
    .toISOString()
    .slice(0, 10)
  const aggregato = new Map<string, number>()

  for (const fattura of db.fatture) {
    if (fattura.data < inizio) continue
    for (const riga of fattura.righe) {
      const articolo = riga.articoloId
        ? db.magazzino.find((a) => a.id === riga.articoloId)
        : undefined
      const categoria = articolo?.categoria ?? 'Manodopera e servizi'
      aggregato.set(categoria, (aggregato.get(categoria) ?? 0) + riga.quantita * riga.prezzoUnitario)
    }
  }

  return [...aggregato.entries()]
    .map(([categoria, ricavo]) => ({ categoria, ricavo }))
    .sort((a, b) => b.ricavo - a.ricavo)
}

/** Numero di riparazioni accettate mese per mese, sugli ultimi `mesi` mesi. */
export function riparazioniPerMese(db: DatabaseGestionale, mesi = 6) {
  const oggi = new Date(`${oggiISO()}T00:00:00`)
  const serie: Array<{ mese: string; etichetta: string; riparazioni: number; incasso: number }> = []

  for (let i = mesi - 1; i >= 0; i--) {
    const data = new Date(oggi.getFullYear(), oggi.getMonth() - i, 1)
    const chiave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
    serie.push({
      mese: chiave,
      etichetta: data.toLocaleDateString('it-IT', { month: 'short' }),
      riparazioni: db.riparazioni.filter((r) => r.dataAccettazione.startsWith(chiave)).length,
      incasso: Math.round(
        db.fatture
          .filter((f) => f.stato === 'pagata' && f.dataPagamento?.startsWith(chiave))
          .reduce((somma, f) => somma + totaleRighe(f.righe), 0),
      ),
    })
  }

  return serie
}
