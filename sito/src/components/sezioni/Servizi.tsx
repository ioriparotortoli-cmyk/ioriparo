'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Timer } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { icone } from '@/lib/icone'
import { categorieServizi, type CategoriaServizio, type Servizio } from '@/lib/dati/servizi'
import { cn, euro } from '@/lib/utils'

export function Servizi({ elenco }: { elenco: Servizio[] }) {
  const [categoria, impostaCategoria] = useState<CategoriaServizio>('Tutti')
  const movimentoRidotto = useReducedMotion()

  const visibili =
    categoria === 'Tutti' ? elenco : elenco.filter((servizio) => servizio.categoria === categoria)

  return (
    <Sezione id="servizi">
      <IntestazioneSezione
        occhiello="Servizi"
        titolo={
          <>
            Tutto quello che serve al tuo <span className="testo-gradiente">dispositivo</span>
          </>
        }
        sottotitolo="Dalla sostituzione del display alla rete aziendale: un unico laboratorio per smartphone, computer e sistemi di sicurezza."
      />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categorieServizi.map((voce) => (
          <button
            key={voce}
            type="button"
            onClick={() => impostaCategoria(voce)}
            aria-pressed={categoria === voce}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200',
              categoria === voce
                ? 'border-elettrico-500 bg-elettrico-600 text-white shadow-[0_8px_24px_-12px_rgba(23,146,209,0.9)]'
                : 'border-[color:var(--bordo)] testo-tenue hover:border-elettrico-500/50 hover:text-elettrico-400',
            )}
          >
            {voce}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visibili.map((servizio, indice) => {
            const Icona = icone[servizio.icona]
            return (
              <motion.li
                key={servizio.slug}
                id={`servizio-${servizio.slug}`}
                layout={!movimentoRidotto}
                initial={movimentoRidotto ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={movimentoRidotto ? undefined : { opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: Math.min(indice * 0.03, 0.3) }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-3xl vetro p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-elettrico-500/50 hover:shadow-bagliore">
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-elettrico-500/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-elettrico-500/25 to-elettrico-700/10 ring-1 ring-elettrico-500/30 transition-transform duration-300 group-hover:scale-110">
                    <Icona className="h-6 w-6 text-elettrico-400" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-[1.05rem] font-bold leading-snug">{servizio.titolo}</h3>
                  <p className="mt-2 text-sm leading-relaxed testo-tenue">{servizio.descrizione}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-[color:var(--bordo)] pt-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 testo-tenue">
                      <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                      {servizio.tempi}
                    </span>
                    <span className="font-bold text-elettrico-400">
                      {servizio.prezzoDa ? `da ${euro(servizio.prezzoDa)}` : 'su preventivo'}
                    </span>
                  </div>

                  <Link
                    href={`/preventivo?servizio=${encodeURIComponent(servizio.titolo)}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-elettrico-400 transition-colors hover:text-elettrico-300"
                  >
                    Chiedi un preventivo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
    </Sezione>
  )
}
