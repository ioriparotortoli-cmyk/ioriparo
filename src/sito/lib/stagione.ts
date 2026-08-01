/**
 * Stagione corrente, per i dettagli decorativi dell'apertura.
 *
 * Si usano le stagioni meteorologiche (trimestri pieni) e non quelle
 * astronomiche: coincidono con la percezione comune e non dipendono dal giorno
 * esatto dell'equinozio, che cambia di anno in anno.
 */
export type Stagione = 'primavera' | 'estate' | 'autunno' | 'inverno'

/**
 * Periodo natalizio: dal 1° dicembre al 6 gennaio, Epifania compresa.
 * È un momento a sé dentro l'inverno, con una decorazione propria.
 */
export function eNatale(adesso = new Date()): boolean {
  const mese = adesso.getMonth() + 1
  return mese === 12 || (mese === 1 && adesso.getDate() <= 6)
}

/**
 * Settimana della ragnatela: una decorazione a tempo, che si aggiunge alla
 * stagione invece di sostituirla.
 *
 * La data di fine è scritta qui dentro apposta: passata quella sparisce da
 * sola. Se dipendesse da qualcuno che si ricorda di toglierla resterebbe su
 * fino a Natale — è così che finiscono tutte le decorazioni a tempo.
 *
 * Estremi compresi, in formato AAAA-MM-GG.
 */
export const SETTIMANA_RAGNO = { dal: '2026-08-01', al: '2026-08-08' }

export function eSettimanaRagno(adesso = new Date()): boolean {
  const g = `${adesso.getFullYear()}-${String(adesso.getMonth() + 1).padStart(2, '0')}-${String(
    adesso.getDate(),
  ).padStart(2, '0')}`
  return g >= SETTIMANA_RAGNO.dal && g <= SETTIMANA_RAGNO.al
}

export function stagioneDi(adesso = new Date()): Stagione {
  const mese = adesso.getMonth() + 1
  if (mese >= 3 && mese <= 5) return 'primavera'
  if (mese >= 6 && mese <= 8) return 'estate'
  if (mese >= 9 && mese <= 11) return 'autunno'
  return 'inverno'
}
