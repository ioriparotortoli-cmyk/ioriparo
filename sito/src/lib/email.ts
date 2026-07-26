import 'server-only'

import { Resend } from 'resend'
import { sito } from '@/lib/config/sito'

const chiave = process.env.RESEND_API_KEY
const mittente = process.env.EMAIL_MITTENTE ?? 'Io Riparo <onboarding@resend.dev>'
const destinatario = process.env.EMAIL_DESTINATARIO ?? sito.contatti.email

export const emailConfigurata = Boolean(chiave)

const client = chiave ? new Resend(chiave) : null

const escape = (valore: string) =>
  valore
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const corpo = (titolo: string, righe: Array<[string, string]>) => `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:#04070f;padding:32px">
    <div style="max-width:560px;margin:0 auto;background:#0a1526;border:1px solid rgba(23,146,209,.35);border-radius:18px;overflow:hidden">
      <div style="padding:20px 26px;background:linear-gradient(100deg,#0f7fc2,#1792d1)">
        <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.02em">Io Riparo</span>
      </div>
      <div style="padding:26px">
        <h1 style="margin:0 0 18px;color:#f2f5ff;font-size:18px">${escape(titolo)}</h1>
        <table style="width:100%;border-collapse:collapse">
          ${righe
            .map(
              ([etichetta, valore]) => `
            <tr>
              <td style="padding:8px 0;color:#93a4bd;font-size:13px;width:38%;vertical-align:top">${escape(
                etichetta,
              )}</td>
              <td style="padding:8px 0;color:#f2f5ff;font-size:14px">${escape(valore).replace(
                /\n/g,
                '<br>',
              )}</td>
            </tr>`,
            )
            .join('')}
        </table>
      </div>
    </div>
  </div>`

type Notifica = {
  titolo: string
  righe: Array<[string, string]>
  rispondiA?: string
}

/** Invia la notifica allo staff. Se Resend non è configurato non fallisce. */
export async function inviaNotifica({ titolo, righe, rispondiA }: Notifica) {
  if (!client) return { inviata: false as const, motivo: 'RESEND_API_KEY non configurata' }

  try {
    const { error } = await client.emails.send({
      from: mittente,
      to: destinatario,
      subject: `${titolo} — ${sito.nome}`,
      html: corpo(titolo, righe),
      replyTo: rispondiA,
    })
    if (error) return { inviata: false as const, motivo: error.message }
    return { inviata: true as const }
  } catch (errore) {
    return {
      inviata: false as const,
      motivo: errore instanceof Error ? errore.message : 'errore sconosciuto',
    }
  }
}
