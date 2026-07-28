import { supabase } from '@/lib/supabase'
import { creaDatabaseIniziale } from './seed'
import type { DatabaseGestionale } from '@/types'

/**
 * Lettura e scrittura dell'archivio online.
 *
 * Ogni riga del database conserva la scheda completa in `dati`, nella stessa
 * forma che usa l'applicazione: non c'è alcuna traduzione dei campi, quindi
 * non c'è nulla che possa disallinearsi fra il codice e le tabelle.
 */

/** Tabelle che contengono un elenco, con la colonna indicizzata da valorizzare. */
const ELENCHI = {
  clienti: null,
  riparazioni: 'codice',
  preventivi: 'numero',
  fatture: 'numero',
  magazzino: 'codice',
  ordini: 'numero',
  scadenze: null,
  impianti: null,
} as const

export type Elenco = keyof typeof ELENCHI

/** Una scheda qualsiasi del gestionale: l'unico campo comune è `id`. */
export type Voce = { id: string }

/** Riga da inviare al database: le colonne separate più la scheda intera. */
function riga(tabella: Elenco, scheda: Voce) {
  const voce = scheda as Record<string, unknown>
  const chiave = ELENCHI[tabella]
  return {
    id: scheda.id,
    ...(chiave ? { [chiave]: voce[chiave] as string } : {}),
    ...(tabella === 'riparazioni' ? { cliente_id: (voce.clienteId as string) || null } : {}),
    dati: scheda,
  }
}

/** Scarica l'intero archivio. Le collezioni assenti restano vuote. */
export async function scaricaArchivio(): Promise<DatabaseGestionale> {
  const sb = supabase
  if (!sb) throw new Error('archivio online non configurato')
  const vuoto = creaDatabaseIniziale()
  const db = { ...vuoto } as DatabaseGestionale

  const nomi = Object.keys(ELENCHI) as Elenco[]
  const risposte = await Promise.all(
    nomi.map((t) => sb.from(t).select('dati').order('creato_il', { ascending: false })),
  )
  nomi.forEach((tabella, i) => {
    const { data, error } = risposte[i]
    if (error) throw new Error(`${tabella}: ${error.message}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(db as any)[tabella] = (data ?? []).map((r) => r.dati)
  })

  const { data: impostazioni } = await sb
    .from('impostazioni')
    .select('azienda, utente')
    .eq('id', 1)
    .maybeSingle()
  if (impostazioni?.azienda && Object.keys(impostazioni.azienda).length)
    db.azienda = { ...vuoto.azienda, ...impostazioni.azienda }
  if (impostazioni?.utente && Object.keys(impostazioni.utente).length)
    db.utente = { ...vuoto.utente, ...impostazioni.utente }

  return db
}

/** Inserisce o aggiorna una voce. */
export async function salvaVoce(tabella: Elenco, voce: Voce) {
  if (!supabase) return
  const { error } = await supabase.from(tabella).upsert(riga(tabella, voce))
  if (error) throw new Error(`${tabella}: ${error.message}`)
}

export async function eliminaVoce(tabella: Elenco, id: string) {
  if (!supabase) return
  const { error } = await supabase.from(tabella).delete().eq('id', id)
  if (error) throw new Error(`${tabella}: ${error.message}`)
}

export async function salvaImpostazioni(parte: 'azienda' | 'utente', valore: unknown) {
  if (!supabase) return
  const { error } = await supabase.from('impostazioni').upsert({ id: 1, [parte]: valore })
  if (error) throw new Error(`impostazioni: ${error.message}`)
}

/** Una richiesta arrivata dal sito. */
export interface Richiesta {
  id: string
  tipo: string
  nome: string
  telefono: string
  email: string | null
  dati: Record<string, string>
  letta: boolean
  ricevuta_il: string
}

/** Le richieste arrivate dal sito, dalla più recente. */
export async function leggiRichieste(): Promise<Richiesta[]> {
  const sb = supabase
  if (!sb) return []
  const { data, error } = await sb
    .from('richieste')
    .select('*')
    .order('ricevuta_il', { ascending: false })
  if (error) throw new Error(`richieste: ${error.message}`)
  return (data ?? []) as Richiesta[]
}

export async function segnaRichiestaLetta(id: string, letta: boolean) {
  const sb = supabase
  if (!sb) return
  const { error } = await sb.from('richieste').update({ letta }).eq('id', id)
  if (error) throw new Error(`richieste: ${error.message}`)
}

export async function eliminaRichiesta(id: string) {
  const sb = supabase
  if (!sb) return
  const { error } = await sb.from('richieste').delete().eq('id', id)
  if (error) throw new Error(`richieste: ${error.message}`)
}

/**
 * Copia l'archivio locale del browser in quello online.
 * Serve al primo passaggio: quello che hai già sul computer non va perso.
 */
export async function caricaArchivio(db: DatabaseGestionale): Promise<number> {
  const sb = supabase
  if (!sb) throw new Error('archivio online non configurato')
  let voci = 0
  for (const tabella of Object.keys(ELENCHI) as Elenco[]) {
    const elenco = db[tabella] as unknown as Voce[]
    if (!elenco?.length) continue
    const { error } = await sb.from(tabella).upsert(elenco.map((v) => riga(tabella, v)))
    if (error) throw new Error(`${tabella}: ${error.message}`)
    voci += elenco.length
  }
  await salvaImpostazioni('azienda', db.azienda)
  await salvaImpostazioni('utente', db.utente)
  return voci
}
