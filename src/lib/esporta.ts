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
export function nomeFileConData(prefisso: string, estensione: string): string {
  return `${prefisso}-${new Date().toISOString().slice(0, 10)}.${estensione}`
}
