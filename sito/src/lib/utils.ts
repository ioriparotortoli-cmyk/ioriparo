/** Unisce classi CSS ignorando valori vuoti o condizionali. */
export function cn(...classi: Array<string | false | null | undefined>) {
  return classi.filter(Boolean).join(' ')
}

const formattatoreEuro = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const euro = (valore: number) => formattatoreEuro.format(valore)

const formattatoreData = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const dataOra = (valore: string | Date) =>
  formattatoreData.format(typeof valore === 'string' ? new Date(valore) : valore)

const formattatoreGiorno = new Intl.DateTimeFormat('it-IT', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

export const giorno = (valore: string | Date) =>
  formattatoreGiorno.format(typeof valore === 'string' ? new Date(valore) : valore)

/** Normalizza un testo per la ricerca interna (minuscolo, senza accenti). */
export const normalizza = (testo: string) =>
  testo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

export const slugifica = (testo: string) =>
  normalizza(testo)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
