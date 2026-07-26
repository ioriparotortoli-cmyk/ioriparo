/**
 * Configurazione unica del sito: dati aziendali, contatti e link.
 * Ogni valore è sovrascrivibile da variabile d'ambiente, così il sito
 * si può riusare senza toccare il codice.
 */

const env = (chiave: string, predefinito: string) => {
  const valore = process.env[chiave]
  return valore && valore.trim().length > 0 ? valore.trim() : predefinito
}

/** Numero in formato internazionale senza spazi, usato per `tel:` e WhatsApp. */
const telefonoE164 = env('NEXT_PUBLIC_TELEFONO', '+393500000000').replace(/[^\d+]/g, '')

const formattaTelefono = (numero: string) =>
  numero.startsWith('+39') && numero.length === 13
    ? `${numero.slice(0, 3)} ${numero.slice(3, 6)} ${numero.slice(6, 9)} ${numero.slice(9)}`
    : numero

export const sito = {
  nome: 'Io Riparo',
  nomeCompleto: 'Io Riparo — Assistenza Informatica',
  slogan: 'Riparazioni rapide, ricambi di qualità e assistenza professionale.',
  descrizione:
    'Centro assistenza informatica a Tortolì: riparazione smartphone, tablet, PC e Mac, sostituzione display e batteria, recupero dati, videosorveglianza e reti aziendali.',
  url: env('NEXT_PUBLIC_SITE_URL', 'https://www.ioriparo.it'),
  lingua: 'it-IT',
  partitaIva: env('NEXT_PUBLIC_PARTITA_IVA', '00000000000'),

  contatti: {
    telefono: telefonoE164,
    telefonoVisibile: formattaTelefono(telefonoE164),
    whatsapp: env('NEXT_PUBLIC_WHATSAPP', telefonoE164).replace(/[^\d]/g, ''),
    email: env('NEXT_PUBLIC_EMAIL', 'info@ioriparo.it'),
  },

  indirizzo: {
    via: 'Via Gianni Rodari 13',
    cap: '08048',
    citta: 'Tortolì',
    provincia: 'NU',
    regione: 'Sardegna',
    nazione: 'IT',
    completo: 'Via Gianni Rodari 13, 08048 Tortolì (NU)',
    latitudine: 39.9272,
    longitudine: 9.657,
  },

  orari: [
    { giorni: 'Lunedì – Venerdì', apertura: '09:00', chiusura: '13:00', pomeriggio: '16:00 – 19:30' },
    { giorni: 'Sabato', apertura: '09:00', chiusura: '13:00', pomeriggio: 'Chiuso' },
    { giorni: 'Domenica', apertura: 'Chiuso', chiusura: 'Chiuso', pomeriggio: 'Chiuso' },
  ],

  /** Formato schema.org `openingHours` per i dati strutturati. */
  orariStrutturati: [
    'Mo-Fr 09:00-13:00',
    'Mo-Fr 16:00-19:30',
    'Sa 09:00-13:00',
  ],

  social: {
    facebook: env('NEXT_PUBLIC_FACEBOOK', 'https://www.facebook.com/ioriparo'),
    instagram: env('NEXT_PUBLIC_INSTAGRAM', 'https://www.instagram.com/ioriparo'),
  },

  /** Scheda Google usata per il pulsante "Lascia una recensione". */
  google: {
    profilo: env('NEXT_PUBLIC_GOOGLE_PROFILO', 'https://g.page/ioriparo'),
    recensioni: env('NEXT_PUBLIC_GOOGLE_RECENSIONI', 'https://g.page/r/ioriparo/review'),
  },
} as const

export const messaggioWhatsapp = encodeURIComponent(
  'Ciao Io Riparo! Vorrei informazioni su una riparazione.',
)

export const linkWhatsapp = `https://wa.me/${sito.contatti.whatsapp}?text=${messaggioWhatsapp}`
export const linkTelefono = `tel:${sito.contatti.telefono}`
export const linkEmail = `mailto:${sito.contatti.email}`

export const linkMappa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${sito.indirizzo.completo}`,
)}`

export const embedMappa = `https://www.google.com/maps?q=${encodeURIComponent(
  sito.indirizzo.completo,
)}&z=16&hl=it&output=embed`
