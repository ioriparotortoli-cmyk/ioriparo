'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition, type ReactNode } from 'react'
import { Bottone } from '@/components/ui/Bottone'
import { cn } from '@/lib/utils'
import type { Esito } from '@/app/admin/azioni'

export function Pannello({
  titolo,
  descrizione,
  azione,
  children,
  className,
}: {
  titolo?: string
  descrizione?: string
  azione?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-3xl border border-[color:var(--bordo)] bg-[color:var(--superficie)] p-6', className)}>
      {(titolo || azione) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {titolo && <h2 className="text-lg font-bold">{titolo}</h2>}
            {descrizione && <p className="mt-1 text-sm testo-tenue">{descrizione}</p>}
          </div>
          {azione}
        </div>
      )}
      {children}
    </section>
  )
}

const colori: Record<string, string> = {
  nuovo: 'bg-elettrico-500/15 text-elettrico-400 border-elettrico-500/30',
  richiesto: 'bg-elettrico-500/15 text-elettrico-400 border-elettrico-500/30',
  inviato: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  confermato: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  accettato: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  completato: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rifiutato: 'bg-red-500/15 text-red-400 border-red-500/30',
  annullato: 'bg-red-500/15 text-red-400 border-red-500/30',
  letto: 'bg-[color:var(--bordo)] testo-tenue',
}

export function Stato({ valore }: { valore: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize',
        colori[valore] ?? 'border-[color:var(--bordo)] testo-tenue',
      )}
    >
      {valore}
    </span>
  )
}

/** Select che invia subito il nuovo stato all'azione server. */
export function CambiaStato({
  valore,
  opzioni,
  azione,
}: {
  valore: string
  opzioni: string[]
  azione: (nuovo: string) => Promise<Esito>
}) {
  const [inCorso, avvia] = useTransition()
  const router = useRouter()

  return (
    <select
      className="campo w-auto py-1.5 text-xs capitalize"
      value={valore}
      disabled={inCorso}
      onChange={(evento) => {
        const nuovo = evento.target.value
        avvia(async () => {
          await azione(nuovo)
          router.refresh()
        })
      }}
    >
      {opzioni.map((opzione) => (
        <option key={opzione} value={opzione}>
          {opzione}
        </option>
      ))}
    </select>
  )
}

export function BottoneElimina({
  azione,
  conferma = 'Confermi l’eliminazione? L’operazione non è reversibile.',
  etichetta = 'Elimina',
}: {
  azione: () => Promise<Esito>
  conferma?: string
  etichetta?: string
}) {
  const [inCorso, avvia] = useTransition()
  const router = useRouter()

  return (
    <button
      type="button"
      disabled={inCorso}
      aria-label={etichetta}
      onClick={() => {
        if (!window.confirm(conferma)) return
        avvia(async () => {
          const esito = await azione()
          if (!esito.ok) window.alert(esito.messaggio)
          router.refresh()
        })
      }}
      className="grid h-9 w-9 place-items-center rounded-xl border border-[color:var(--bordo)] testo-tenue transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
    >
      {inCorso ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  )
}

/** Form generico collegato a una azione server, con messaggio di esito. */
export function ModuloAzione({
  azione,
  children,
  etichetta,
  reimposta = false,
  className,
}: {
  azione: (dati: FormData) => Promise<Esito>
  children: ReactNode
  etichetta: string
  reimposta?: boolean
  className?: string
}) {
  const [messaggio, impostaMessaggio] = useState<Esito | null>(null)
  const [inCorso, avvia] = useTransition()
  const router = useRouter()

  return (
    <form
      className={cn('space-y-4', className)}
      onSubmit={(evento) => {
        evento.preventDefault()
        const modulo = evento.currentTarget
        const dati = new FormData(modulo)
        avvia(async () => {
          const esito = await azione(dati)
          impostaMessaggio(esito)
          if (esito.ok && reimposta) modulo.reset()
          router.refresh()
        })
      }}
    >
      {children}

      {messaggio && (
        <p
          role="status"
          className={cn(
            'rounded-2xl border px-4 py-2.5 text-sm',
            messaggio.ok
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/40 bg-red-500/10 text-red-400',
          )}
        >
          {messaggio.messaggio}
        </p>
      )}

      <Bottone type="submit" disabled={inCorso}>
        {inCorso && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {etichetta}
      </Bottone>
    </form>
  )
}

export function Vuoto({ testo }: { testo: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-[color:var(--bordo)] px-5 py-10 text-center text-sm testo-tenue">
      {testo}
    </p>
  )
}

export function AvvisoConfigurazione() {
  return (
    <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-400">
      <p className="font-semibold">Supabase non è configurato</p>
      <p className="mt-2">
        Imposta <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> e{' '}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, esegui{' '}
        <code>supabase/schema.sql</code> e crea l’utente dello staff in Supabase Auth.
      </p>
    </div>
  )
}
