import type { Fattura, Preventivo, RigaIntervento, RigaOrdine, Riparazione } from '@/types'

/**
 * Convenzione: i prezzi inseriti in riparazioni, preventivi e fatture sono
 * al pubblico, quindi **IVA inclusa**. L'imposta viene scorporata dal totale.
 */

export function totaleRighe(righe: Array<RigaIntervento | RigaOrdine>): number {
  return righe.reduce((somma, riga) => somma + riga.quantita * riga.prezzoUnitario, 0)
}

/** Scorpora l'IVA da un totale lordo (es. 122 con IVA 22% → 22). */
export function scorporoIva(totaleLordo: number, aliquota: number): number {
  return totaleLordo - totaleLordo / (1 + aliquota / 100)
}

export function imponibile(totaleLordo: number, aliquota: number): number {
  return totaleLordo / (1 + aliquota / 100)
}

export function totaleRiparazione(riparazione: Riparazione): number {
  return totaleRighe(riparazione.interventi)
}

/** Quanto resta da incassare al ritiro, dedotto l'eventuale acconto. */
export function saldoRiparazione(riparazione: Riparazione): number {
  return Math.max(0, totaleRiparazione(riparazione) - (riparazione.acconto ?? 0))
}

export function totalePreventivo(preventivo: Preventivo): number {
  return totaleRighe(preventivo.righe)
}

export function totaleFattura(fattura: Fattura): number {
  return totaleRighe(fattura.righe)
}

/** Margine percentuale di un articolo di magazzino. */
export function margine(prezzoAcquisto: number, prezzoVendita: number): number {
  if (prezzoVendita <= 0) return 0
  return ((prezzoVendita - prezzoAcquisto) / prezzoVendita) * 100
}
