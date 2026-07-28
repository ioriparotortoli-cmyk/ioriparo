import { useState, type FormEvent } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Campo, Input } from '@/components/ui/Form'
import { Logo } from '@/components/layout/Logo'
import { supabase } from '@/lib/supabase'

/** Messaggi di Supabase tradotti in italiano comprensibile. */
function motivo(messaggio: string): string {
  const m = messaggio.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail o password non corretti.'
  if (m.includes('email not confirmed')) return 'L’indirizzo e-mail non è ancora stato confermato.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Troppi tentativi ravvicinati: riprova fra qualche minuto.'
  if (m.includes('fetch') || m.includes('network'))
    return 'Nessuna connessione all’archivio. Controlla la rete e riprova.'
  return 'Accesso non riuscito. Riprova fra poco.'
}

/**
 * Porta d'ingresso del gestionale.
 *
 * L'archivio online è chiuso a chi non è autenticato: senza questo accesso le
 * tabelle non restituiscono nulla, quindi non è una protezione di facciata ma
 * l'unico modo per leggere e scrivere i dati dell'attività.
 */
export function Accesso() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inCorso, setInCorso] = useState(false)
  const [errore, setErrore] = useState<string | null>(null)

  async function entra(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setInCorso(true)
    setErrore(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setInCorso(false)
    // In caso di successo non c'è nulla da fare qui: il provider si accorge
    // del nuovo accesso e ricarica l'archivio.
    if (error) setErrore(motivo(error.message))
  }

  return (
    <div className="grid min-h-screen place-items-center bg-base p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <form
          onSubmit={entra}
          className="rounded-card border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
        >
          <h1 className="text-[15px] font-semibold text-ink">Accesso al gestionale</h1>
          <p className="mt-0.5 text-xs text-ink-faint">Riservato al personale di Io Riparo.</p>

          <div className="mt-4 space-y-3">
            <Campo etichetta="E-mail">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </Campo>
            <Campo etichetta="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Campo>
          </div>

          {errore && (
            <p role="alert" className="mt-3 text-xs text-rose-400">
              {errore}
            </p>
          )}

          <Button type="submit" variante="primario" className="mt-4 w-full" disabled={inCorso}>
            {inCorso ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <KeyRound className="size-4" aria-hidden="true" />
            )}
            {inCorso ? 'Accesso in corso…' : 'Entra'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Password dimenticata? Si reimposta dal pannello Supabase, sezione Authentication.
        </p>
      </div>
    </div>
  )
}
