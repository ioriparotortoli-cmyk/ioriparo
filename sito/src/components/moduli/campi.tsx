'use client'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Campo({
  etichetta,
  nome,
  children,
  obbligatorio = false,
  suggerimento,
}: {
  etichetta: string
  nome: string
  children: ReactNode
  obbligatorio?: boolean
  suggerimento?: string
}) {
  return (
    <div>
      <label className="etichetta" htmlFor={nome}>
        {etichetta}
        {obbligatorio && <span className="ml-1 text-elettrico-400">*</span>}
      </label>
      {children}
      {suggerimento && <p className="mt-1.5 text-xs testo-tenue">{suggerimento}</p>}
    </div>
  )
}

export function Consenso({ nome = 'privacy' }: { nome?: string }) {
  return (
    <label className="flex items-start gap-3 text-sm testo-tenue">
      <input
        type="checkbox"
        name={nome}
        required
        className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded border-[color:var(--bordo)] accent-[#1792d1]"
      />
      <span>
        Ho letto e accetto la{' '}
        <Link href="/privacy-policy" className="font-semibold text-elettrico-400 hover:underline">
          Privacy Policy
        </Link>{' '}
        e acconsento al trattamento dei dati per essere ricontattato. <span className="text-elettrico-400">*</span>
      </span>
    </label>
  )
}

/** Campo trappola per i bot: invisibile e mai compilato da una persona. */
export function Trappola() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="azienda">Non compilare</label>
      <input id="azienda" name="azienda" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

export type StatoInvio =
  | { tipo: 'inattivo' }
  | { tipo: 'invio' }
  | { tipo: 'ok'; messaggio: string }
  | { tipo: 'errore'; messaggio: string }

export function Esito({ stato }: { stato: StatoInvio }) {
  if (stato.tipo !== 'ok' && stato.tipo !== 'errore') return null

  const positivo = stato.tipo === 'ok'
  const Icona = positivo ? CheckCircle2 : AlertTriangle

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm',
        positivo
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
          : 'border-red-500/40 bg-red-500/10 text-red-400',
      )}
    >
      <Icona className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
      <span>{stato.messaggio}</span>
    </p>
  )
}

export function Caricatore({ children, inCorso }: { children: ReactNode; inCorso: boolean }) {
  return (
    <>
      {inCorso && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  )
}

/** Gestisce invio, stato e reset di un modulo che scrive su una route API. */
export function useInvioModulo(endpoint: string) {
  const [stato, impostaStato] = useState<StatoInvio>({ tipo: 'inattivo' })

  const invia = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const modulo = evento.currentTarget
    impostaStato({ tipo: 'invio' })

    try {
      const risposta = await fetch(endpoint, { method: 'POST', body: new FormData(modulo) })
      const dati = (await risposta.json()) as { ok?: boolean; messaggio?: string }

      if (!risposta.ok || !dati.ok) {
        impostaStato({
          tipo: 'errore',
          messaggio: dati.messaggio ?? 'Invio non riuscito. Riprova o chiamaci direttamente.',
        })
        return
      }

      impostaStato({ tipo: 'ok', messaggio: dati.messaggio ?? 'Richiesta inviata correttamente.' })
      modulo.reset()
    } catch {
      impostaStato({
        tipo: 'errore',
        messaggio: 'Connessione non riuscita. Controlla la rete oppure scrivici su WhatsApp.',
      })
    }
  }

  return { stato, invia, inCorso: stato.tipo === 'invio' }
}
