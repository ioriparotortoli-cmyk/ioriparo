import 'server-only'

import { recensioni as recensioniStatiche, type Recensione } from '@/lib/dati/contenuti'
import { supabaseAdmin } from '@/lib/supabase/server'

type RisultatoRecensioni = {
  elenco: Recensione[]
  media: number
  totale: number
  fonte: 'google' | 'pannello' | 'statiche'
}

type RecensioneGoogle = {
  authorAttribution?: { displayName?: string }
  rating?: number
  relativePublishTimeDescription?: string
  originalText?: { text?: string }
  text?: { text?: string }
}

const iniziali = (nome: string) =>
  nome
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')

/** Recensioni pubblicate dal pannello amministratore. */
async function recensioniPannello(): Promise<RisultatoRecensioni | null> {
  const supabase = supabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('recensioni')
    .select('autore,testo,valutazione,dispositivo,data_testo')
    .eq('pubblicata', true)
    .order('creata_il', { ascending: false })
    .limit(9)

  if (error || !data || data.length === 0) return null

  const elenco = (data as Array<{
    autore: string
    testo: string
    valutazione: number
    dispositivo: string | null
    data_testo: string | null
  }>).map((riga) => ({
    autore: riga.autore,
    iniziali: iniziali(riga.autore),
    valutazione: riga.valutazione,
    data: riga.data_testo ?? '',
    testo: riga.testo,
    dispositivo: riga.dispositivo ?? 'Riparazione',
  }))

  const media = elenco.reduce((somma, voce) => somma + voce.valutazione, 0) / elenco.length

  return { elenco, media, totale: elenco.length, fonte: 'pannello' }
}

/**
 * Recensioni Google tramite Places API (New), con ricaduta su quelle
 * pubblicate dal pannello e infine su quelle statiche: la sezione è sempre
 * renderizzabile e non blocca mai la pagina.
 */
export async function caricaRecensioni(): Promise<RisultatoRecensioni> {
  const chiave = process.env.GOOGLE_PLACES_API_KEY
  const idLuogo = process.env.GOOGLE_PLACE_ID

  const statiche: RisultatoRecensioni = {
    elenco: recensioniStatiche,
    media: 5,
    totale: recensioniStatiche.length,
    fonte: 'statiche',
  }

  const riserva = (await recensioniPannello()) ?? statiche

  if (!chiave || !idLuogo) return riserva

  try {
    const risposta = await fetch(
      `https://places.googleapis.com/v1/places/${idLuogo}?languageCode=it`,
      {
        headers: {
          'X-Goog-Api-Key': chiave,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
        // Aggiornamento giornaliero: nessun costo sulle prestazioni del sito.
        next: { revalidate: 86400 },
      },
    )

    if (!risposta.ok) return riserva

    const dati = (await risposta.json()) as {
      rating?: number
      userRatingCount?: number
      reviews?: RecensioneGoogle[]
    }

    const elenco = (dati.reviews ?? [])
      .filter((voce) => (voce.rating ?? 0) >= 4)
      .map((voce) => {
        const autore = voce.authorAttribution?.displayName ?? 'Cliente Google'
        return {
          autore,
          iniziali: iniziali(autore),
          valutazione: voce.rating ?? 5,
          data: voce.relativePublishTimeDescription ?? '',
          testo: voce.originalText?.text ?? voce.text?.text ?? '',
          dispositivo: 'Recensione Google',
        } satisfies Recensione
      })
      .filter((voce) => voce.testo.length > 0)

    if (elenco.length === 0) return riserva

    return {
      elenco,
      media: dati.rating ?? 5,
      totale: dati.userRatingCount ?? elenco.length,
      fonte: 'google',
    }
  } catch {
    return riserva
  }
}
