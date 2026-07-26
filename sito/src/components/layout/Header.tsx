'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { Ricerca } from './Ricerca'
import { useTema } from './FornitoreTema'
import { BottoneLink } from '@/components/ui/Bottone'
import { linkTelefono, sito } from '@/lib/config/sito'
import { cn } from '@/lib/utils'

const voci = [
  { etichetta: 'Servizi', href: '/#servizi' },
  { etichetta: 'Perché noi', href: '/#perche' },
  { etichetta: 'Come lavoriamo', href: '/#processo' },
  { etichetta: 'Recensioni', href: '/#recensioni' },
  { etichetta: 'Galleria', href: '/#galleria' },
  { etichetta: 'FAQ', href: '/#faq' },
  { etichetta: 'Contatti', href: '/#contatti' },
]

export function Header() {
  const [scorso, impostaScorso] = useState(false)
  const [menuAperto, impostaMenuAperto] = useState(false)
  const { tema, cambiaTema } = useTema()

  useEffect(() => {
    const suScroll = () => impostaScorso(window.scrollY > 12)
    suScroll()
    window.addEventListener('scroll', suScroll, { passive: true })
    return () => window.removeEventListener('scroll', suScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuAperto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAperto])

  return (
    <header
      className={cn(
        'no-stampa fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scorso ? 'vetro shadow-[0_8px_30px_-16px_rgba(0,0,0,0.6)]' : 'border-b border-transparent',
      )}
    >
      <div className="contenitore flex h-18 items-center justify-between gap-4">
        <Logo priorita />

        <nav aria-label="Navigazione principale" className="hidden items-center gap-1 xl:flex">
          {voci.map((voce) => (
            <Link
              key={voce.href}
              href={voce.href}
              className="relative whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium testo-tenue transition-colors hover:text-elettrico-400"
            >
              {voce.etichetta}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden md:block">
            <Ricerca />
          </span>

          <button
            type="button"
            onClick={cambiaTema}
            aria-label={tema === 'dark' ? 'Attiva il tema chiaro' : 'Attiva il tema scuro'}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--bordo)] transition-colors hover:border-elettrico-500/50 hover:text-elettrico-400"
          >
            {tema === 'dark' ? <Sun className="h-[1.15rem] w-[1.15rem]" /> : <Moon className="h-[1.15rem] w-[1.15rem]" />}
          </button>

          <span className="hidden 2xl:block">
            <BottoneLink
              href={linkTelefono}
              variante="contorno"
              className="whitespace-nowrap"
              aria-label={`Chiama ${sito.contatti.telefonoVisibile}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {sito.contatti.telefonoVisibile}
            </BottoneLink>
          </span>

          <span className="hidden sm:block">
            <BottoneLink href="/preventivo" className="whitespace-nowrap">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Preventivo
            </BottoneLink>
          </span>

          <span className="xl:hidden">
            <button
              type="button"
              onClick={() => impostaMenuAperto(true)}
              aria-label="Apri il menu"
              aria-expanded={menuAperto}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--bordo)]"
            >
              <Menu className="h-5 w-5" />
            </button>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {menuAperto && (
          <motion.div
            className="fixed inset-0 z-[60] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => impostaMenuAperto(false)}
            />
            <motion.nav
              aria-label="Menu mobile"
              className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col vetro p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              style={{ backgroundColor: 'var(--superficie)' }}
            >
              <div className="flex items-center justify-between">
                <Logo compatto />
                <button
                  type="button"
                  onClick={() => impostaMenuAperto(false)}
                  aria-label="Chiudi il menu"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--bordo)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="mt-8 flex flex-col gap-1">
                {voci.map((voce, indice) => (
                  <motion.li
                    key={voce.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + indice * 0.04 }}
                  >
                    <Link
                      href={voce.href}
                      onClick={() => impostaMenuAperto(false)}
                      className="block rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-elettrico-500/10 hover:text-elettrico-400"
                    >
                      {voce.etichetta}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-6">
                <Ricerca className="w-full justify-center" />
                <BottoneLink href="/prenota" variante="contorno" onClick={() => impostaMenuAperto(false)}>
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Prenota appuntamento
                </BottoneLink>
                <BottoneLink href="/preventivo" onClick={() => impostaMenuAperto(false)}>
                  Richiedi preventivo
                </BottoneLink>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
