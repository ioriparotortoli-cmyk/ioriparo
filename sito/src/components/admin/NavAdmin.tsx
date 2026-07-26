'use client'

import {
  CalendarClock,
  Image as IconaImmagine,
  LayoutDashboard,
  LogOut,
  Percent,
  Star,
  Wrench,
  FileText,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { cn } from '@/lib/utils'

const voci = [
  { href: '/admin', etichetta: 'Riepilogo', icona: LayoutDashboard },
  { href: '/admin/preventivi', etichetta: 'Preventivi', icona: FileText },
  { href: '/admin/appuntamenti', etichetta: 'Appuntamenti', icona: CalendarClock },
  { href: '/admin/messaggi', etichetta: 'Messaggi', icona: MessageCircle },
  { href: '/admin/servizi', etichetta: 'Servizi e prezzi', icona: Wrench },
  { href: '/admin/offerte', etichetta: 'Offerte', icona: Percent },
  { href: '/admin/recensioni', etichetta: 'Recensioni', icona: Star },
  { href: '/admin/immagini', etichetta: 'Immagini', icona: IconaImmagine },
]

export function NavAdmin({ email }: { email: string }) {
  const percorso = usePathname()
  const router = useRouter()
  const [uscita, impostaUscita] = useState(false)

  const esci = async () => {
    impostaUscita(true)
    const supabase = supabaseBrowser()
    await supabase?.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <nav
      aria-label="Navigazione pannello"
      className="fixed inset-x-0 top-18 z-30 border-b border-[color:var(--bordo)] superficie-alt xl:inset-y-0 xl:top-0 xl:w-64 xl:border-b-0 xl:border-r xl:pt-24"
    >
      <div className="flex items-center gap-1 overflow-x-auto scorrimento-nascosto px-4 py-3 xl:flex-col xl:items-stretch xl:overflow-visible xl:px-4">
        {voci.map((voce) => {
          const attiva = percorso === voce.href
          return (
            <Link
              key={voce.href}
              href={voce.href}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors xl:w-full',
                attiva
                  ? 'bg-elettrico-600 text-white'
                  : 'testo-tenue hover:bg-elettrico-500/10 hover:text-elettrico-400',
              )}
            >
              <voce.icona className="h-4 w-4 shrink-0" aria-hidden="true" />
              {voce.etichetta}
            </Link>
          )
        })}

        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0 xl:mt-6 xl:w-full xl:flex-col xl:items-stretch xl:border-t xl:border-[color:var(--bordo)] xl:pt-4">
          <span className="hidden truncate px-3.5 text-xs testo-tenue xl:block" title={email}>
            {email}
          </span>
          <button
            type="button"
            onClick={esci}
            disabled={uscita}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold testo-tenue transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {uscita ? 'Uscita…' : 'Esci'}
          </button>
        </div>
      </div>
    </nav>
  )
}
