import { AZIENDA } from '../dati/azienda'

/**
 * Invio dei moduli del sito.
 *
 * Il sito è statico: non c'è un backend e nessuna richiesta viene salvata nel
 * browser. Ogni modulo viene recapitato per e-mail a `AZIENDA.email` in due modi:
 *
 * 1. **Servizio di invio** (consigliato). Basta impostare `VITE_MODULI_ENDPOINT`
 *    nel file `.env` con l'indirizzo fornito dal servizio scelto — Formspree,
 *    Web3Forms, Getform, Basin o equivalenti. I dati partono in JSON e arrivano
 *    nella casella senza che il visitatore lasci il sito.
 *
 * 2. **Client di posta** (ripiego automatico). Se l'endpoint non è configurato
 *    il modulo apre il programma di posta del visitatore con destinatario,
 *    oggetto e testo già compilati: il sito resta usabile da subito.
 *
 * Per attivare il primo metodo:
 *   VITE_MODULI_ENDPOINT="https://formspree.io/f/xxxxxxx"
 *   VITE_MODULI_CHIAVE="…"      # solo per i servizi che richiedono una chiave
 */

const ENDPOINT = (import.meta.env.VITE_MODULI_ENDPOINT as string | undefined)?.trim()
const CHIAVE = (import.meta.env.VITE_MODULI_CHIAVE as string | undefined)?.trim()

/** Vero quando il servizio di invio è configurato. */
export const invioAttivo = Boolean(ENDPOINT)

export type Modulo = 'contatti' | 'preventivo' | 'appuntamento' | 'newsletter'

export interface DatiModulo {
  /** Etichetta → valore, nell'ordine in cui compaiono nell'e-mail */
  campi: Record<string, string>
  /** Indirizzo a cui rispondere */
  email: string
  nome?: string
}

export type Esito =
  | { ok: true; via: 'servizio' | 'posta' }
  | { ok: false; errore: string }

const OGGETTI: Record<Modulo, string> = {
  contatti: 'Nuovo messaggio dal sito',
  preventivo: 'Nuova richiesta di preventivo dal sito',
  appuntamento: 'Nuova richiesta di appuntamento dal sito',
  newsletter: 'Nuova iscrizione alla newsletter',
}

const corpoTestuale = (dati: DatiModulo) =>
  Object.entries(dati.campi)
    .filter(([, v]) => v)
    .map(([etichetta, valore]) => `${etichetta}: ${valore}`)
    .join('\n')

/** Apre il client di posta con il messaggio già pronto. */
function apriPosta(modulo: Modulo, dati: DatiModulo): Esito {
  const oggetto = encodeURIComponent(`${OGGETTI[modulo]} — ${dati.nome ?? dati.email}`)
  const corpo = encodeURIComponent(`${corpoTestuale(dati)}\n\n—\nInviato dal sito ${AZIENDA.nome}`)
  window.location.href = `mailto:${AZIENDA.email}?subject=${oggetto}&body=${corpo}`
  return { ok: true, via: 'posta' }
}

/**
 * Recapita il modulo. Non solleva eccezioni: in caso di problema di rete
 * ripiega sul client di posta, così la richiesta del cliente non va persa.
 */
export async function inviaModulo(modulo: Modulo, dati: DatiModulo): Promise<Esito> {
  if (!ENDPOINT) return apriPosta(modulo, dati)

  const corpo: Record<string, unknown> = {
    ...dati.campi,
    email: dati.email,
    _replyto: dati.email,
    _subject: `${OGGETTI[modulo]} — ${dati.nome ?? dati.email}`,
    modulo,
    origine: window.location.href,
  }
  if (CHIAVE) corpo.access_key = CHIAVE

  try {
    const risposta = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corpo),
    })
    if (!risposta.ok) throw new Error(`stato ${risposta.status}`)
    return { ok: true, via: 'servizio' }
  } catch {
    return apriPosta(modulo, dati)
  }
}

/**
 * Filtro anti-spam senza CAPTCHA: un campo invisibile che solo i robot
 * compilano e un tempo minimo di compilazione.
 */
export function sospetto(esca: string, apertoIl: number): boolean {
  return esca.trim().length > 0 || Date.now() - apertoIl < 2500
}

/** Campo esca da inserire in ogni modulo: invisibile e non raggiungibile da tastiera. */
export const propsEsca = {
  type: 'text' as const,
  name: 'indirizzo-secondario',
  tabIndex: -1,
  autoComplete: 'off',
  'aria-hidden': true,
  style: {
    position: 'absolute' as const,
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: 0,
    pointerEvents: 'none' as const,
  },
}
