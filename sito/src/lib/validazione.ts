import { z } from 'zod'

const testo = (min: number, max: number, campo: string) =>
  z
    .string({ error: `${campo}: campo obbligatorio` })
    .trim()
    .min(min, `${campo}: inserisci almeno ${min} caratteri`)
    .max(max, `${campo}: massimo ${max} caratteri`)

const telefono = z
  .string()
  .trim()
  .min(6, 'Telefono: numero non valido')
  .max(24, 'Telefono: numero non valido')
  .regex(/^[+0-9 ()./-]+$/, 'Telefono: sono ammessi solo numeri e i segni + ( ) - / .')

const email = z.email('Email: indirizzo non valido').max(120)

const privacy = z
  .union([z.literal('on'), z.literal('true'), z.boolean()])
  .transform(() => true)
  .refine((valore) => valore === true, 'Devi accettare l’informativa privacy')

/** Campo anti-spam nascosto: se valorizzato la richiesta viene scartata. */
export const honeypot = z.string().max(0).optional().or(z.literal(''))

export const schemaPreventivo = z.object({
  nome: testo(2, 80, 'Nome'),
  telefono,
  email,
  dispositivo: testo(2, 80, 'Dispositivo'),
  servizio: testo(2, 80, 'Servizio').optional().or(z.literal('')),
  problema: testo(10, 1500, 'Descrizione del problema'),
  privacy,
  azienda: honeypot,
})

export const schemaAppuntamento = z.object({
  nome: testo(2, 80, 'Nome'),
  telefono,
  email,
  servizio: testo(2, 80, 'Servizio'),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data: formato non valido')
    .refine((valore) => {
      const scelta = new Date(`${valore}T00:00:00`)
      const oggi = new Date()
      oggi.setHours(0, 0, 0, 0)
      return scelta.getTime() >= oggi.getTime()
    }, 'Data: scegli una data futura'),
  ora: z.string().regex(/^\d{2}:\d{2}$/, 'Ora: formato non valido'),
  modalita: z.enum(['negozio', 'domicilio', 'remoto']),
  note: z.string().trim().max(1000).optional().or(z.literal('')),
  privacy,
  azienda: honeypot,
})

export const schemaContatto = z.object({
  nome: testo(2, 80, 'Nome'),
  email,
  telefono: telefono.optional().or(z.literal('')),
  messaggio: testo(10, 2000, 'Messaggio'),
  privacy,
  azienda: honeypot,
})

export type DatiPreventivo = z.infer<typeof schemaPreventivo>
export type DatiAppuntamento = z.infer<typeof schemaAppuntamento>
export type DatiContatto = z.infer<typeof schemaContatto>

/** Trasforma gli errori di zod in un messaggio unico leggibile. */
export const messaggioErrore = (errore: z.ZodError) =>
  errore.issues.map((problema) => problema.message).join(' · ')

export const MAX_FOTO = 4
export const MAX_BYTE_FOTO = 5 * 1024 * 1024
export const TIPI_FOTO = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']
