import type { Metadata } from 'next'
import { NavAdmin } from '@/components/admin/NavAdmin'
import { utenteCorrente } from '@/lib/supabase/server'
import { supabaseConfigurato } from '@/lib/supabase/config'

export const metadata: Metadata = {
  title: 'Area riservata',
  robots: { index: false, follow: false, nocache: true },
}

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const utente = supabaseConfigurato ? await utenteCorrente() : null

  return (
    <div className="min-h-dvh pt-18">
      {utente && <NavAdmin email={utente.email ?? ''} />}
      <div className={utente ? 'xl:pl-64' : ''}>
        <div className="contenitore py-10">{children}</div>
      </div>
    </div>
  )
}
