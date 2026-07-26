'use client'

import { LogIn } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Bottone } from '@/components/ui/Bottone'
import { Campo, Esito, type StatoInvio } from '@/components/moduli/campi'
import { supabaseBrowser } from '@/lib/supabase/browser'

export function ModuloLogin() {
  const router = useRouter()
  const parametri = useSearchParams()
  const [stato, impostaStato] = useState<StatoInvio>({ tipo: 'inattivo' })

  const accedi = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const dati = new FormData(evento.currentTarget)
    const supabase = supabaseBrowser()

    if (!supabase) {
      impostaStato({ tipo: 'errore', messaggio: 'Supabase non è configurato.' })
      return
    }

    impostaStato({ tipo: 'invio' })

    const { error } = await supabase.auth.signInWithPassword({
      email: String(dati.get('email') ?? ''),
      password: String(dati.get('password') ?? ''),
    })

    if (error) {
      impostaStato({
        tipo: 'errore',
        messaggio:
          error.message === 'Invalid login credentials'
            ? 'Email o password non corretti.'
            : error.message,
      })
      return
    }

    impostaStato({ tipo: 'ok', messaggio: 'Accesso effettuato, apertura del pannello…' })
    router.replace(parametri.get('successivo') ?? '/admin')
    router.refresh()
  }

  return (
    <form onSubmit={accedi} className="space-y-4">
      <Campo etichetta="Email" nome="email" obbligatorio>
        <input id="email" name="email" type="email" className="campo" required autoComplete="email" />
      </Campo>

      <Campo etichetta="Password" nome="password" obbligatorio>
        <input
          id="password"
          name="password"
          type="password"
          className="campo"
          required
          autoComplete="current-password"
          minLength={6}
        />
      </Campo>

      <Esito stato={stato} />

      <Bottone type="submit" disabled={stato.tipo === 'invio'} dimensione="lg" className="w-full">
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {stato.tipo === 'invio' ? 'Accesso in corso…' : 'Accedi'}
      </Bottone>
    </form>
  )
}
