import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from './config'

/**
 * Client legato alla sessione dell'utente (cookie): usato dal pannello
 * amministratore per leggere e scrivere rispettando le policy RLS.
 */
export async function supabaseServer() {
  if (!supabaseConfigurato) return null
  const store = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (elenco) => {
        try {
          elenco.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // In un Server Component i cookie sono di sola lettura: il refresh
          // della sessione avviene nel middleware.
        }
      },
    },
  })
}

/**
 * Client con chiave di servizio: solo per le route API (scrittura di
 * preventivi, appuntamenti e messaggi ignorando RLS). Mai esposto al browser.
 */
export function supabaseAdmin() {
  const chiave = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseConfigurato || !chiave) return null

  return createClient(SUPABASE_URL, chiave, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Sessione corrente (o `null` se Supabase non è configurato). */
export async function utenteCorrente() {
  const supabase = await supabaseServer()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}
