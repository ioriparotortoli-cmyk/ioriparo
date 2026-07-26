import 'server-only'

import { supabaseAdmin } from '@/lib/supabase/server'
import { icone, type NomeIcona } from '@/lib/icone'
import { servizi as serviziStatici, type Servizio } from './servizi'

type RigaServizio = {
  slug: string
  titolo: string
  descrizione: string
  icona: string
  categoria: string
  prezzo_da: number | null
  tempi: string
  attivo: boolean
  ordine: number | null
}

const categorieValide: Servizio['categoria'][] = ['Dispositivi', 'Riparazioni', 'Software', 'Sistemi']

/**
 * Servizi pubblicati dal pannello amministratore. Senza Supabase (o in caso di
 * errore) si usa il catalogo statico: la home resta sempre completa e veloce.
 */
export async function caricaServizi(): Promise<Servizio[]> {
  const supabase = supabaseAdmin()
  if (!supabase) return serviziStatici

  const { data, error } = await supabase
    .from('servizi')
    .select('slug,titolo,descrizione,icona,categoria,prezzo_da,tempi,attivo,ordine')
    .eq('attivo', true)
    .order('ordine', { ascending: true, nullsFirst: false })

  if (error || !data || data.length === 0) return serviziStatici

  return (data as RigaServizio[]).map((riga) => ({
    slug: riga.slug,
    titolo: riga.titolo,
    descrizione: riga.descrizione,
    icona: (riga.icona in icone ? riga.icona : 'ricambi') as NomeIcona,
    categoria: categorieValide.includes(riga.categoria as Servizio['categoria'])
      ? (riga.categoria as Servizio['categoria'])
      : 'Riparazioni',
    prezzoDa: riga.prezzo_da,
    tempi: riga.tempi,
  }))
}
