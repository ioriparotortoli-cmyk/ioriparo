import 'server-only'

import { supabaseAdmin } from '@/lib/supabase/server'

export type Offerta = {
  id: string
  titolo: string
  descrizione: string
  sconto: string | null
  valida_fino: string | null
  immagine: string | null
}

/**
 * Offerte pubblicate dal pannello. Se Supabase non è configurato la sezione
 * semplicemente non compare: nessun contenuto finto in pagina.
 */
export async function caricaOfferte(): Promise<Offerta[]> {
  const supabase = supabaseAdmin()
  if (!supabase) return []

  const oggi = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('offerte')
    .select('id,titolo,descrizione,sconto,valida_fino,immagine')
    .eq('pubblicata', true)
    .or(`valida_fino.is.null,valida_fino.gte.${oggi}`)
    .order('creata_il', { ascending: false })
    .limit(3)

  if (error || !data) return []
  return data as Offerta[]
}
