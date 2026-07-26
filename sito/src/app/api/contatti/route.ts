import { NextResponse } from 'next/server'
import { errore, indirizzoRichiesta, limiteSuperato, ok } from '@/lib/api'
import { inviaNotifica } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/server'
import { messaggioErrore, schemaContatto } from '@/lib/validazione'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(richiesta: Request) {
  if (limiteSuperato(`contatto:${indirizzoRichiesta(richiesta)}`)) {
    return errore('Troppi messaggi ravvicinati. Riprova tra qualche minuto o chiamaci.', 429)
  }

  let modulo: FormData
  try {
    modulo = await richiesta.formData()
  } catch {
    return errore('Formato della richiesta non valido.')
  }

  const analisi = schemaContatto.safeParse({
    nome: modulo.get('nome'),
    email: modulo.get('email'),
    telefono: modulo.get('telefono') ?? '',
    messaggio: modulo.get('messaggio'),
    privacy: modulo.get('privacy') ?? false,
    azienda: modulo.get('azienda') ?? '',
  })

  if (!analisi.success) return errore(messaggioErrore(analisi.error))

  const dati = analisi.data
  if (dati.azienda) return ok('Messaggio ricevuto.')

  const supabase = supabaseAdmin()

  if (supabase) {
    const { error } = await supabase.from('messaggi').insert({
      nome: dati.nome,
      email: dati.email,
      telefono: dati.telefono || null,
      messaggio: dati.messaggio,
      stato: 'nuovo',
    })

    if (error) {
      return NextResponse.json(
        { ok: false, messaggio: 'Non siamo riusciti a inviare il messaggio. Riprova o chiamaci.' },
        { status: 500 },
      )
    }
  }

  const notifica = await inviaNotifica({
    titolo: 'Nuovo messaggio dal sito',
    rispondiA: dati.email,
    righe: [
      ['Nome', dati.nome],
      ['Email', dati.email],
      ['Telefono', dati.telefono || '—'],
      ['Messaggio', dati.messaggio],
    ],
  })

  if (!supabase && !notifica.inviata) {
    return ok(
      'Messaggio registrato in modalità dimostrativa: configura Supabase o Resend per riceverlo davvero.',
      { dimostrativo: true },
    )
  }

  return ok('Messaggio inviato. Ti rispondiamo entro poche ore negli orari di apertura.')
}
