import type { Metadata } from 'next'
import { Suspense } from 'react'
import { KeyRound } from 'lucide-react'
import { ModuloLogin } from '@/components/admin/ModuloLogin'
import { supabaseConfigurato } from '@/lib/supabase/config'

export const metadata: Metadata = {
  title: 'Accesso area riservata',
  robots: { index: false, follow: false },
}

export default function PaginaLogin() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-4xl vetro p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-elettrico-500/15 ring-1 ring-elettrico-500/30">
          <KeyRound className="h-6 w-6 text-elettrico-400" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Area riservata</h1>
        <p className="mt-2 text-sm testo-tenue">
          Accesso riservato allo staff di Io Riparo per gestire preventivi, appuntamenti e contenuti
          del sito.
        </p>

        {supabaseConfigurato ? (
          <div className="mt-7">
            <Suspense fallback={<p className="text-sm testo-tenue">Caricamento…</p>}>
              <ModuloLogin />
            </Suspense>
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3.5 text-sm text-amber-400">
            Supabase non è configurato. Imposta <code>NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> nel file <code>.env.local</code>, poi esegui
            lo schema in <code>supabase/schema.sql</code>.
          </div>
        )}
      </div>
    </div>
  )
}
