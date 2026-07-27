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
  /** Indirizzo a cui rispondere: facoltativo, alcuni moduli chiedono solo il telefono */
  email?: string
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

/**
 * Indirizzo di risposta valido, se il visitatore lo ha lasciato: un valore
 * inventato come "non indicata" farebbe scartare la richiesta dal servizio.
 */
const rispostaA = (dati: DatiModulo) => {
  const email = dati.email?.trim()
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : undefined
}

/** Oggetto dell'e-mail: chi ha scritto, riconoscibile già dall'elenco messaggi. */
const oggettoDi = (modulo: Modulo, dati: DatiModulo) =>
  `${OGGETTI[modulo]} — ${dati.nome ?? rispostaA(dati) ?? AZIENDA.nome}`

/** Apre il client di posta con il messaggio già pronto. */
function apriPosta(modulo: Modulo, dati: DatiModulo): Esito {
  const oggetto = encodeURIComponent(oggettoDi(modulo, dati))
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

  const risposta = rispostaA(dati)
  const corpo: Record<string, unknown> = {
    ...dati.campi,
    ...(risposta ? { email: risposta, _replyto: risposta } : {}),
    _subject: oggettoDi(modulo, dati),
    modulo,
    origine: window.location.href,
  }
  if (CHIAVE) corpo.access_key = CHIAVE

  try {
    const esito = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corpo),
    })
    if (!esito.ok) throw new Error(`stato ${esito.status}`)
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
