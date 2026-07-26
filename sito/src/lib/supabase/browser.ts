'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurato } from './config'

/** Client Supabase lato browser (login del pannello amministratore). */
export const supabaseBrowser = () => {
  if (!supabaseConfigurato) return null
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
