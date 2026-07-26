'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server'
import { BUCKET_MEDIA } from '@/lib/supabase/config'
import { slugifica } from '@/lib/utils'

export type Esito = { ok: boolean; messaggio: string }

/** Client autenticato: le policy RLS bloccano chi non ha una sessione valida. */
async function client() {
  const supabase = await supabaseServer()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ? supabase : null
}

const nonAutorizzato: Esito = { ok: false, messaggio: 'Sessione scaduta: rifai l’accesso.' }

const testo = (dati: FormData, campo: string) => String(dati.get(campo) ?? '').trim()
const numero = (dati: FormData, campo: string) => {
  const valore = testo(dati, campo)
  return valore === '' ? null : Number(valore.replace(',', '.'))
}

function aggiorna(percorsi: string[]) {
  percorsi.forEach((percorso) => revalidatePath(percorso))
  revalidatePath('/')
}

/* ------------------------------------------------------------------ servizi */

export async function salvaServizio(dati: FormData): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const titolo = testo(dati, 'titolo')
  if (titolo.length < 2) return { ok: false, messaggio: 'Il titolo è obbligatorio.' }

  const riga = {
    slug: testo(dati, 'slug') || slugifica(titolo),
    titolo,
    descrizione: testo(dati, 'descrizione'),
    icona: testo(dati, 'icona') || 'ricambi',
    categoria: testo(dati, 'categoria') || 'Riparazioni',
    prezzo_da: numero(dati, 'prezzo_da'),
    tempi: testo(dati, 'tempi') || 'su preventivo',
    attivo: dati.get('attivo') === 'on',
    ordine: numero(dati, 'ordine'),
  }

  const id = testo(dati, 'id')
  const { error } = id
    ? await supabase.from('servizi').update(riga).eq('id', id)
    : await supabase.from('servizi').insert(riga)

  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/servizi'])
  return { ok: true, messaggio: id ? 'Servizio aggiornato.' : 'Servizio creato.' }
}

export async function eliminaServizio(id: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('servizi').delete().eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/servizi'])
  return { ok: true, messaggio: 'Servizio eliminato.' }
}

/* --------------------------------------------------------------- preventivi */

export async function aggiornaPreventivo(id: string, stato: string, prezzo?: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const campi: Record<string, unknown> = { stato }
  if (prezzo !== undefined && prezzo !== '') campi.prezzo = Number(prezzo.replace(',', '.'))

  const { error } = await supabase.from('preventivi').update(campi).eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/preventivi', '/admin'])
  return { ok: true, messaggio: 'Preventivo aggiornato.' }
}

export async function eliminaPreventivo(id: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('preventivi').delete().eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/preventivi', '/admin'])
  return { ok: true, messaggio: 'Preventivo eliminato.' }
}

/* ------------------------------------------------------------- appuntamenti */

export async function aggiornaAppuntamento(id: string, stato: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('appuntamenti').update({ stato }).eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/appuntamenti', '/admin'])
  return { ok: true, messaggio: 'Appuntamento aggiornato.' }
}

export async function eliminaAppuntamento(id: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('appuntamenti').delete().eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/appuntamenti', '/admin'])
  return { ok: true, messaggio: 'Appuntamento eliminato.' }
}

/* ------------------------------------------------------------------ offerte */

export async function salvaOfferta(dati: FormData): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const titolo = testo(dati, 'titolo')
  if (titolo.length < 2) return { ok: false, messaggio: 'Il titolo è obbligatorio.' }

  const riga = {
    titolo,
    descrizione: testo(dati, 'descrizione'),
    sconto: testo(dati, 'sconto') || null,
    valida_fino: testo(dati, 'valida_fino') || null,
    immagine: testo(dati, 'immagine') || null,
    pubblicata: dati.get('pubblicata') === 'on',
  }

  const id = testo(dati, 'id')
  const { error } = id
    ? await supabase.from('offerte').update(riga).eq('id', id)
    : await supabase.from('offerte').insert(riga)

  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/offerte'])
  return { ok: true, messaggio: id ? 'Offerta aggiornata.' : 'Offerta pubblicata.' }
}

export async function eliminaOfferta(id: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('offerte').delete().eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/offerte'])
  return { ok: true, messaggio: 'Offerta eliminata.' }
}

/* ---------------------------------------------------------------- recensioni */

export async function salvaRecensione(dati: FormData): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const autore = testo(dati, 'autore')
  const contenuto = testo(dati, 'testo')
  if (autore.length < 2 || contenuto.length < 10) {
    return { ok: false, messaggio: 'Servono autore e testo della recensione.' }
  }

  const riga = {
    autore,
    testo: contenuto,
    valutazione: Number(testo(dati, 'valutazione') || 5),
    dispositivo: testo(dati, 'dispositivo') || null,
    data_testo: testo(dati, 'data_testo') || null,
    pubblicata: dati.get('pubblicata') === 'on',
  }

  const id = testo(dati, 'id')
  const { error } = id
    ? await supabase.from('recensioni').update(riga).eq('id', id)
    : await supabase.from('recensioni').insert(riga)

  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/recensioni'])
  return { ok: true, messaggio: id ? 'Recensione aggiornata.' : 'Recensione aggiunta.' }
}

export async function eliminaRecensione(id: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('recensioni').delete().eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/recensioni'])
  return { ok: true, messaggio: 'Recensione eliminata.' }
}

/* ----------------------------------------------------------------- immagini */

export async function caricaImmagine(dati: FormData): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const file = dati.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, messaggio: 'Seleziona un file da caricare.' }
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, messaggio: 'L’immagine supera 8 MB.' }
  }
  if (!file.type.startsWith('image/')) {
    return { ok: false, messaggio: 'Il file deve essere un’immagine.' }
  }

  const cartella = testo(dati, 'cartella') || 'galleria'
  const estensione = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const nome = `${slugifica(file.name.replace(/\.[^.]+$/, '')) || 'immagine'}-${Date.now().toString(36)}.${estensione}`

  const { error } = await supabase.storage
    .from(BUCKET_MEDIA)
    .upload(`${cartella}/${nome}`, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    })

  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/immagini'])
  return { ok: true, messaggio: 'Immagine caricata.' }
}

export async function eliminaImmagine(percorso: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.storage.from(BUCKET_MEDIA).remove([percorso])
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/immagini'])
  return { ok: true, messaggio: 'Immagine eliminata.' }
}

/* ----------------------------------------------------------------- messaggi */

export async function aggiornaMessaggio(id: string, stato: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('messaggi').update({ stato }).eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/messaggi', '/admin'])
  return { ok: true, messaggio: 'Messaggio aggiornato.' }
}

export async function eliminaMessaggio(id: string): Promise<Esito> {
  const supabase = await client()
  if (!supabase) return nonAutorizzato

  const { error } = await supabase.from('messaggi').delete().eq('id', id)
  if (error) return { ok: false, messaggio: error.message }

  aggiorna(['/admin/messaggi', '/admin'])
  return { ok: true, messaggio: 'Messaggio eliminato.' }
}
