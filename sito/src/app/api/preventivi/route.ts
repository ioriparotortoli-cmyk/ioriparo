import { NextResponse } from 'next/server'
import { errore, indirizzoRichiesta, limiteSuperato, ok } from '@/lib/api'
import { inviaNotifica } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/server'
import { BUCKET_MEDIA } from '@/lib/supabase/config'
import { MAX_BYTE_FOTO, MAX_FOTO, TIPI_FOTO, messaggioErrore, schemaPreventivo } from '@/lib/validazione'
import { slugifica } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Carica le foto del dispositivo su Supabase Storage e ne restituisce gli URL. */
async function caricaFoto(file: File[], riferimento: string) {
  const supabase = supabaseAdmin()
  if (!supabase || file.length === 0) return []

  const url: string[] = []

  for (const [indice, foto] of file.entries()) {
    const estensione = foto.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const percorso = `preventivi/${riferimento}/${indice + 1}-${slugifica(foto.name.replace(/\.[^.]+$/, ''))}.${estensione}`

    const { error } = await supabase.storage
      .from(BUCKET_MEDIA)
      .upload(percorso, await foto.arrayBuffer(), { contentType: foto.type, upsert: false })

    if (error) continue

    const { data } = supabase.storage.from(BUCKET_MEDIA).getPublicUrl(percorso)
    url.push(data.publicUrl)
  }

  return url
}

export async function POST(richiesta: Request) {
  if (limiteSuperato(`preventivo:${indirizzoRichiesta(richiesta)}`)) {
    return errore('Troppe richieste ravvicinate. Riprova tra qualche minuto o chiamaci.', 429)
  }

  let modulo: FormData
  try {
    modulo = await richiesta.formData()
  } catch {
    return errore('Formato della richiesta non valido.')
  }

  const analisi = schemaPreventivo.safeParse({
    nome: modulo.get('nome'),
    telefono: modulo.get('telefono'),
    email: modulo.get('email'),
    dispositivo: modulo.get('dispositivo'),
    servizio: modulo.get('servizio') ?? '',
    problema: modulo.get('problema'),
    privacy: modulo.get('privacy') ?? false,
    azienda: modulo.get('azienda') ?? '',
  })

  if (!analisi.success) return errore(messaggioErrore(analisi.error))

  const dati = analisi.data
  if (dati.azienda) return ok('Richiesta ricevuta.') // bot: risposta neutra

  const foto = modulo
    .getAll('foto')
    .filter((voce): voce is File => voce instanceof File && voce.size > 0)
    .slice(0, MAX_FOTO)

  if (foto.some((file) => file.size > MAX_BYTE_FOTO)) {
    return errore('Ogni foto deve pesare meno di 5 MB.')
  }
  if (foto.some((file) => !TIPI_FOTO.includes(file.type))) {
    return errore('Formato foto non supportato: usa JPG, PNG, WEBP o HEIC.')
  }

  const riferimento = `PRV-${Date.now().toString(36).toUpperCase()}`
  const urlFoto = await caricaFoto(foto, riferimento)

  const supabase = supabaseAdmin()
  if (supabase) {
    const { error } = await supabase.from('preventivi').insert({
      riferimento,
      nome: dati.nome,
      telefono: dati.telefono,
      email: dati.email,
      dispositivo: dati.dispositivo,
      servizio: dati.servizio || null,
      problema: dati.problema,
      foto: urlFoto,
      stato: 'nuovo',
    })

    if (error) {
      return NextResponse.json(
        { ok: false, messaggio: 'Non siamo riusciti a salvare la richiesta. Riprova o chiamaci.' },
        { status: 500 },
      )
    }
  }

  const notifica = await inviaNotifica({
    titolo: `Nuova richiesta di preventivo ${riferimento}`,
    rispondiA: dati.email,
    righe: [
      ['Nome', dati.nome],
      ['Telefono', dati.telefono],
      ['Email', dati.email],
      ['Dispositivo', dati.dispositivo],
      ['Servizio', dati.servizio || 'da valutare'],
      ['Problema', dati.problema],
      ['Foto allegate', urlFoto.length > 0 ? urlFoto.join('\n') : 'nessuna'],
    ],
  })

  if (!supabase && !notifica.inviata) {
    return ok(
      `Richiesta ${riferimento} registrata. Il sito è in modalità dimostrativa: configura Supabase o Resend per riceverla davvero.`,
      { riferimento, dimostrativo: true },
    )
  }

  return ok(
    `Richiesta ${riferimento} inviata. Ti ricontattiamo entro poche ore con il preventivo gratuito.`,
    { riferimento },
  )
}
