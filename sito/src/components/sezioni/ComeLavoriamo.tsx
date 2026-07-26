'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { processo } from '@/lib/dati/contenuti'
import { icone } from '@/lib/icone'

/** Timeline verticale con linea che si riempie durante lo scorrimento. */
export function ComeLavoriamo() {
  const contenitore = useRef<HTMLOListElement>(null)
  const movimentoRidotto = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: contenitore,
    offset: ['start 75%', 'end 55%'],
  })
  const altezza = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  return (
    <Sezione id="processo">
      <IntestazioneSezione
        occhiello="Come lavoriamo"
        titolo={
          <>
            Cinque passi, <span className="testo-gradiente">zero sorprese</span>
          </>
        }
        sottotitolo="Dal momento in cui ci porti il dispositivo alla consegna con garanzia, sai sempre a che punto siamo."
      />

      <ol ref={contenitore} className="relative mx-auto max-w-3xl">
        <span
          className="absolute left-6 top-2 h-[calc(100%-1rem)] w-px bg-[color:var(--bordo)] md:left-1/2"
          aria-hidden="true"
        />
        {!movimentoRidotto && (
          <motion.span
            className="absolute left-6 top-2 w-px origin-top bg-gradient-to-b from-elettrico-400 to-elettrico-700 md:left-1/2"
            style={{ height: altezza }}
            aria-hidden="true"
          />
        )}

        {processo.map((passo, indice) => {
          const Icona = icone[passo.icona]
          const aDestra = indice % 2 === 1

          return (
            <motion.li
              key={passo.numero}
              className="relative pb-10 pl-20 last:pb-0 md:pl-0"
              initial={movimentoRidotto ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span className="absolute left-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--superficie)] ring-1 ring-elettrico-500/40 md:left-1/2 md:-translate-x-1/2">
                <Icona className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-elettrico-600 text-[0.65rem] font-bold text-white">
                  {passo.numero}
                </span>
              </span>

              <div
                className={`rounded-3xl vetro p-6 transition-colors duration-300 hover:border-elettrico-500/50 md:w-[calc(50%-3rem)] ${
                  aDestra ? 'md:ml-auto' : ''
                }`}
              >
                <h3 className="text-lg font-bold">{passo.titolo}</h3>
                <p className="mt-2 text-sm leading-relaxed testo-tenue">{passo.descrizione}</p>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </Sezione>
  )
}
