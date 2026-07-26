'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { faq } from '@/lib/dati/contenuti'
import { servizi } from '@/lib/dati/servizi'
import { normalizza } from '@/lib/utils'

type Voce = {
  titolo: string
  descrizione: string
  href: string
  gruppo: 'Servizi' | 'Pagine' | 'Domande frequenti'
  chiavi: string
}

const pagine: Array<Omit<Voce, 'chiavi'>> = [
  { titolo: 'Home', descrizione: 'Torna alla pagina principale', href: '/', gruppo: 'Pagine' },
  {
    titolo: 'Richiedi preventivo',
    descrizione: 'Modulo con foto del dispositivo',
    href: '/preventivo',
    gruppo: 'Pagine',
  },
  {
    titolo: 'Prenota un appuntamento',
    descrizione: 'Scegli giorno, ora e modalità',
    href: '/prenota',
    gruppo: 'Pagine',
  },
  { titolo: 'Contatti e mappa', descrizione: 'Dove siamo e orari', href: '/#contatti', gruppo: 'Pagine' },
  { titolo: 'Galleria', descrizione: 'Riparazioni, prima e dopo, laboratorio', href: '/#galleria', gruppo: 'Pagine' },
  { titolo: 'Recensioni', descrizione: 'Cosa dicono i clienti su Google', href: '/#recensioni', gruppo: 'Pagine' },
  { titolo: 'Privacy Policy', descrizione: 'Trattamento dei dati personali', href: '/privacy-policy', gruppo: 'Pagine' },
  { titolo: 'Cookie Policy', descrizione: 'Cookie utilizzati dal sito', href: '/cookie-policy', gruppo: 'Pagine' },
]

const indice: Voce[] = [
  ...servizi.map((servizio) => ({
    titolo: servizio.titolo,
    descrizione: servizio.descrizione,
    href: `/#servizio-${servizio.slug}`,
    gruppo: 'Servizi' as const,
    chiavi: normalizza(`${servizio.titolo} ${servizio.descrizione} ${servizio.categoria}`),
  })),
  ...pagine.map((pagina) => ({
    ...pagina,
    chiavi: normalizza(`${pagina.titolo} ${pagina.descrizione}`),
  })),
  ...faq.map((voce) => ({
    titolo: voce.domanda,
    descrizione: voce.risposta.slice(0, 110) + '…',
    href: '/#faq',
    gruppo: 'Domande frequenti' as const,
    chiavi: normalizza(`${voce.domanda} ${voce.risposta}`),
  })),
]

export function Ricerca({ className }: { className?: string }) {
  const [aperta, impostaAperta] = useState(false)
  const [query, impostaQuery] = useState('')
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const scorciatoia = (evento: KeyboardEvent) => {
      if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === 'k') {
        evento.preventDefault()
        impostaAperta((valore) => !valore)
      }
      if (evento.key === 'Escape') impostaAperta(false)
    }
    window.addEventListener('keydown', scorciatoia)
    return () => window.removeEventListener('keydown', scorciatoia)
  }, [])

  useEffect(() => {
    if (aperta) {
      document.body.style.overflow = 'hidden'
      const attesa = setTimeout(() => campo.current?.focus(), 60)
      return () => {
        clearTimeout(attesa)
        document.body.style.overflow = ''
      }
    }
  }, [aperta])

  const risultati = useMemo(() => {
    const termine = normalizza(query)
    if (termine.length < 2) return indice.filter((voce) => voce.gruppo !== 'Domande frequenti').slice(0, 6)
    return indice
      .map((voce) => {
        const posizione = voce.chiavi.indexOf(termine)
        return { voce, punteggio: posizione < 0 ? Infinity : posizione }
      })
      .filter((elemento) => elemento.punteggio !== Infinity)
      .sort((a, b) => a.punteggio - b.punteggio)
      .slice(0, 8)
      .map((elemento) => elemento.voce)
  }, [query])

  return (
    <>
      <button
        type="button"
        onClick={() => impostaAperta(true)}
        aria-label="Cerca nel sito"
        className={`inline-flex items-center gap-2 rounded-xl border border-[color:var(--bordo)] px-3 py-2 text-sm testo-tenue transition-colors hover:border-elettrico-500/50 hover:text-elettrico-400 ${className ?? ''}`}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden lg:inline">Cerca…</span>
        <kbd className="hidden rounded border border-[color:var(--bordo)] px-1.5 py-0.5 text-[0.65rem] lg:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {aperta && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => impostaAperta(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Ricerca nel sito"
          >
            <motion.div
              className="w-full max-w-xl overflow-hidden rounded-3xl vetro shadow-2xl"
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(evento) => evento.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-[color:var(--bordo)] px-5 py-4">
                <Search className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
                <input
                  ref={campo}
                  value={query}
                  onChange={(evento) => impostaQuery(evento.target.value)}
                  placeholder="Cerca un servizio, una risposta, una pagina…"
                  className="w-full bg-transparent text-base outline-none placeholder:text-[color:var(--testo-tenue)]"
                  type="search"
                />
                <button
                  type="button"
                  onClick={() => impostaAperta(false)}
                  aria-label="Chiudi la ricerca"
                  className="rounded-lg p-1 testo-tenue transition-colors hover:text-elettrico-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="max-h-[52vh] overflow-y-auto p-2">
                {risultati.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm testo-tenue">
                    Nessun risultato. Scrivici su WhatsApp: ti rispondiamo subito.
                  </li>
                )}
                {risultati.map((voce) => (
                  <li key={`${voce.gruppo}-${voce.titolo}`}>
                    <Link
                      href={voce.href}
                      onClick={() => impostaAperta(false)}
                      className="group flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-elettrico-500/10"
                    >
                      <span className="mt-0.5 rounded-lg bg-elettrico-500/15 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-elettrico-400">
                        {voce.gruppo}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{voce.titolo}</span>
                        <span className="mt-0.5 block truncate text-xs testo-tenue">
                          {voce.descrizione}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 testo-tenue transition-transform group-hover:translate-x-0.5 group-hover:text-elettrico-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
