/**
 * Dati dell'attività: unica fonte per intestazione, contatti, piè di pagina,
 * dati strutturati Schema.org e collegamenti rapidi (telefono, WhatsApp, mappa).
 */

export interface FasciaOraria {
  giorno: string
  /** Indice del giorno secondo `Date.getDay()` (0 = domenica) */
  indice: number
  orario: string
  /** Intervalli di apertura in ore decimali, per calcolare "aperto ora" */
  fasce: [number, number][]
}

export const AZIENDA = {
  nome: 'Io Riparo',
  claim: 'come posso aiutare?',
  descrizione:
    'Centro di assistenza tecnica per smartphone, tablet, computer e notebook, recupero dati, videosorveglianza, reti aziendali e impianti Wi-Fi a Tortolì e in tutta l\'Ogliastra.',
  indirizzo: 'Via Campidano 7',
  cap: '08048',
  citta: 'Tortolì',
  provincia: 'NU',
  regione: 'Ogliastra, Sardegna',
  telefono: '377 381 97 87',
  email: 'ioriparo15@gmail.com',
  emailPrivacy: 'ioriparo15@gmail.com',
  partitaIva: '08123450726',
  fondata: 2013,
  mappa: 'https://www.google.com/maps/search/?api=1&query=Io+Riparo+Via+Campidano+7+Tortol%C3%AC',
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
  },
} as const

/** Numero in formato E.164, usato per `tel:` e per i collegamenti WhatsApp. */
export const TELEFONO_E164 = '+39' + AZIENDA.telefono.replace(/\D/g, '')
export const WHATSAPP = `https://wa.me/${TELEFONO_E164.replace('+', '')}`
export const INDIRIZZO_COMPLETO = `${AZIENDA.indirizzo}, ${AZIENDA.cap} ${AZIENDA.citta} (${AZIENDA.provincia})`

export const ORARI: FasciaOraria[] = [
  { giorno: 'Lunedì', indice: 1, orario: '09:00–13:00 · 16:00–19:30', fasce: [[9, 13], [16, 19.5]] },
  { giorno: 'Martedì', indice: 2, orario: '09:00–13:00 · 16:00–19:30', fasce: [[9, 13], [16, 19.5]] },
  { giorno: 'Mercoledì', indice: 3, orario: '09:00–13:00 · 16:00–19:30', fasce: [[9, 13], [16, 19.5]] },
  { giorno: 'Giovedì', indice: 4, orario: '09:00–13:00 · 16:00–19:30', fasce: [[9, 13], [16, 19.5]] },
  { giorno: 'Venerdì', indice: 5, orario: '09:00–13:00 · 16:00–19:30', fasce: [[9, 13], [16, 19.5]] },
  { giorno: 'Sabato', indice: 6, orario: '09:00–13:00', fasce: [[9, 13]] },
  { giorno: 'Domenica', indice: 0, orario: 'Chiuso', fasce: [] },
]

/** Vero se l'attività è aperta nell'istante indicato. */
export function apertoOra(adesso = new Date()): boolean {
  const oggi = ORARI.find((o) => o.indice === adesso.getDay())
  if (!oggi) return false
  const ora = adesso.getHours() + adesso.getMinutes() / 60
  return oggi.fasce.some(([da, a]) => ora >= da && ora < a)
}

/** Orario di chiusura successivo, per il messaggio "aperti fino alle …". */
export function chiusuraOdierna(adesso = new Date()): string | null {
  const oggi = ORARI.find((o) => o.indice === adesso.getDay())
  if (!oggi || !oggi.fasce.length) return null
  const ora = adesso.getHours() + adesso.getMinutes() / 60
  const fascia = oggi.fasce.find(([, a]) => ora < a)
  if (!fascia) return null
  const ore = Math.floor(fascia[1])
  const minuti = Math.round((fascia[1] - ore) * 60)
  return `${String(ore).padStart(2, '0')}:${String(minuti).padStart(2, '0')}`
}
