'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { linkTelefono, linkWhatsapp, sito } from '@/lib/config/sito'

/** Pulsanti sempre visibili: WhatsApp, Chiama ora e ritorno a inizio pagina. */
export function AzioniFlottanti() {
  const [mostraSu, impostaMostraSu] = useState(false)
  const percorso = usePathname()

  useEffect(() => {
    const suScroll = () => impostaMostraSu(window.scrollY > 600)
    window.addEventListener('scroll', suScroll, { passive: true })
    return () => window.removeEventListener('scroll', suScroll)
  }, [])

  if (percorso?.startsWith('/admin')) return null

  return (
    <div className="no-stampa fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 md:bottom-7 md:right-6">
      <AnimatePresence>
        {mostraSu && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Torna a inizio pagina"
            className="grid h-11 w-11 place-items-center rounded-full vetro shadow-lg transition-colors hover:text-elettrico-400"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={linkTelefono}
        aria-label={`Chiama ora ${sito.contatti.telefonoVisibile}`}
        className="group flex h-13 items-center gap-2 rounded-full bg-elettrico-600 pl-3.5 pr-4 text-white shadow-[0_12px_34px_-12px_rgba(23,146,209,0.95)] transition-all hover:bg-elettrico-500 active:scale-95 md:h-14"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100 md:group-hover:pr-1">
          Chiama ora
        </span>
      </a>

      <a
        href={linkWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scrivici su WhatsApp"
        className="group relative flex h-13 items-center gap-2 rounded-full bg-[#25D366] pl-3.5 pr-4 text-[#04120a] shadow-[0_12px_34px_-12px_rgba(37,211,102,0.95)] transition-all hover:bg-[#1fbe5b] active:scale-95 md:h-14"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 animate-pulsazione" />
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
          WhatsApp
        </span>
      </a>
    </div>
  )
}
