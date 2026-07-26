import 'server-only'

import { NextResponse } from 'next/server'

export const ok = (messaggio: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: true, messaggio, ...extra })

export const errore = (messaggio: string, stato = 400) =>
  NextResponse.json({ ok: false, messaggio }, { status: stato })

/**
 * Limitatore di frequenza in memoria: protegge i moduli dagli invii ripetuti.
 * Su più istanze serverless il conteggio è per istanza — sufficiente come
 * prima barriera, affiancata al campo trappola anti-bot.
 */
const richieste = new Map<string, { conteggio: number; scadenza: number }>()

export function limiteSuperato(chiave: string, massimo = 5, finestraMs = 10 * 60 * 1000) {
  const adesso = Date.now()
  const voce = richieste.get(chiave)

  if (!voce || voce.scadenza < adesso) {
    richieste.set(chiave, { conteggio: 1, scadenza: adesso + finestraMs })
    return false
  }

  voce.conteggio += 1

  // Pulizia opportunistica delle chiavi scadute.
  if (richieste.size > 500) {
    richieste.forEach((valore, id) => {
      if (valore.scadenza < adesso) richieste.delete(id)
    })
  }

  return voce.conteggio > massimo
}

export const indirizzoRichiesta = (richiesta: Request) =>
  richiesta.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  richiesta.headers.get('x-real-ip') ??
  'sconosciuto'
