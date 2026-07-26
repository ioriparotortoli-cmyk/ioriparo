import { NextResponse } from 'next/server'
import { errore, indirizzoRichiesta, limiteSuperato, ok } from '@/lib/api'
import { inviaNotifica } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/server'
import { messaggioErrore, schemaAppuntamento } from '@/lib/validazione'
import { giorno } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(richiesta: Request) {
  if (limiteSuperato(`appuntamento:${indirizzoRichiesta(richiesta)}`)) {
    return errore('Troppe richieste ravvicinate. Riprova tra qualche minuto o chiamaci.', 429)
  }

  let modulo: FormData
  try {
    modulo = await richiesta.formData()
  } catch {
    return errore('Formato della richiesta non valido.')
  }

  const analisi = schemaAppuntamento.safeParse({
    nome: modulo.get('nome'),
    telefono: modulo.get('telefono'),
    email: modulo.get('email'),
    servizio: modulo.get('servizio'),
    data: modulo.get('data'),
    ora: modulo.get('ora'),
    modalita: modulo.get('modalita') ?? 'negozio',
    note: modulo.get('note') ?? '',
    privacy: modulo.get('privacy') ?? false,
    azienda: modulo.get('azienda') ?? '',
  })

  if (!analisi.success) return errore(messaggioErrore(analisi.error))

  const dati = analisi.data
  if (dati.azienda) return ok('Richiesta ricevuta.')

  const riferimento = `APP-${Date.now().toString(36).toUpperCase()}`
  const supabase = supabaseAdmin()

  if (supabase) {
    // Uno slot per volta: se è già occupato lo comunichiamo subito.
    const { data: occupato } = await supabase
      .from('appuntamenti')
      .select('id')
      .eq('data', dati.data)
      .eq('ora', dati.ora)
      .neq('stato', 'annullato')
      .maybeSingle()

    if (occupato) {
      return errore('Quell’orario è appena stato prenotato: scegline un altro, ci sono altri slot liberi.', 409)
    }

    const { error } = await supabase.from('appuntamenti').insert({
      riferimento,
      nome: dati.nome,
      telefono: dati.telefono,
      email: dati.email,
      servizio: dati.servizio,
      data: dati.data,
      ora: dati.ora,
      modalita: dati.modalita,
      note: dati.note || null,
      stato: 'richiesto',
    })

    if (error) {
      return NextResponse.json(
        { ok: false, messaggio: 'Non siamo riusciti a registrare l’appuntamento. Riprova o chiamaci.' },
        { status: 500 },
      )
    }
  }

  const notifica = await inviaNotifica({
    titolo: `Nuovo appuntamento ${riferimento}`,
    rispondiA: dati.email,
    righe: [
      ['Nome', dati.nome],
      ['Telefono', dati.telefono],
      ['Email', dati.email],
      ['Servizio', dati.servizio],
      ['Quando', `${giorno(dati.data)} alle ${dati.ora}`],
      ['Modalità', dati.modalita],
      ['Note', dati.note || '—'],
    ],
  })

  if (!supabase && !notifica.inviata) {
    return ok(
      `Appuntamento ${riferimento} registrato in modalità dimostrativa: configura Supabase o Resend per riceverlo davvero.`,
      { riferimento, dimostrativo: true },
    )
  }

  return ok(
    `Appuntamento richiesto per ${giorno(dati.data)} alle ${dati.ora}. Ti confermiamo con una chiamata o un messaggio.`,
    { riferimento },
  )
}
