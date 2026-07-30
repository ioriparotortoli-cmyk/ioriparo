/** Esportazione di dati in CSV e JSON tramite download nel browser. */

function scarica(contenuto: BlobPart, nomeFile: string, tipo: string) {
  const url = URL.createObjectURL(new Blob([contenuto], { type: tipo }))
  const link = document.createElement('a')
  link.href = url
  link.download = nomeFile
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function cella(valore: unknown): string {
  const testo = valore === null || valore === undefined ? '' : String(valore)
  return `"${testo.replace(/"/g, '""')}"`
}

/**
 * Genera un CSV con separatore `;` (atteso da Excel in locale italiano)
 * e BOM UTF-8 per la corretta resa degli accenti.
 */
export function esportaCsv(
  nomeFile: string,
  intestazioni: string[],
  righe: Array<Array<string | number | undefined>>,
) {
  const contenuto = [intestazioni, ...righe].map((riga) => riga.map(cella).join(';')).join('\r\n')
  scarica(`﻿${contenuto}`, nomeFile, 'text/csv;charset=utf-8')
}

export function esportaJson(nomeFile: string, dati: unknown) {
  scarica(JSON.stringify(dati, null, 2), nomeFile, 'application/json')
}

/** Nome file con data odierna, es. `riparazioni-2024-05-18.csv`. */
/**
 * Nome del file di backup a partire dall'attività: «Ripara Facile» diventa
 * `ripara-facile-backup`. Prima era scritto a mano con il nome di Io Riparo, e
 * su un'altra installazione il cliente si sarebbe ritrovato nella cartella
 * Download un file col nome di un'altra ditta.
 */
export function nomeArchivio(nomeAzienda: string): string {
  const pulito = nomeAzienda
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return pulito ? `${pulito}-backup` : 'backup-gestionale'
}

export function nomeFileConData(prefisso: string, estensione: string): string {
  return `${prefisso}-${new Date().toISOString().slice(0, 10)}.${estensione}`
}
