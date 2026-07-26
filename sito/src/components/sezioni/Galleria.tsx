'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Expand, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { categorieGalleria, galleria, type FotoGalleria } from '@/lib/dati/contenuti'
import { cn } from '@/lib/utils'

type Categoria = (typeof categorieGalleria)[number]

export function Galleria() {
  const [categoria, impostaCategoria] = useState<Categoria>('Tutte')
  const [ingrandita, impostaIngrandita] = useState<FotoGalleria | null>(null)
  const movimentoRidotto = useReducedMotion()

  const visibili =
    categoria === 'Tutte' ? galleria : galleria.filter((foto) => foto.categoria === categoria)

  useEffect(() => {
    const chiudi = (evento: KeyboardEvent) => evento.key === 'Escape' && impostaIngrandita(null)
    window.addEventListener('keydown', chiudi)
    return () => window.removeEventListener('keydown', chiudi)
  }, [])

  return (
    <Sezione id="galleria">
      <IntestazioneSezione
        occhiello="Galleria"
        titolo={
          <>
            Il nostro <span className="testo-gradiente">laboratorio</span> al lavoro
          </>
        }
        sottotitolo="Riparazioni reali, confronti prima e dopo e la strumentazione che usiamo ogni giorno."
      />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categorieGalleria.map((voce) => (
          <button
            key={voce}
            type="button"
            onClick={() => impostaCategoria(voce)}
            aria-pressed={categoria === voce}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200',
              categoria === voce
                ? 'border-elettrico-500 bg-elettrico-600 text-white'
                : 'border-[color:var(--bordo)] testo-tenue hover:border-elettrico-500/50 hover:text-elettrico-400',
            )}
          >
            {voce}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibili.map((foto, indice) => (
            <motion.li
              key={foto.file}
              layout={!movimentoRidotto}
              initial={movimentoRidotto ? false : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={movimentoRidotto ? undefined : { opacity: 0, scale: 0.95 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: Math.min(indice * 0.05, 0.25) }}
            >
              <button
                type="button"
                onClick={() => impostaIngrandita(foto)}
                className="group relative block w-full overflow-hidden rounded-3xl border border-[color:var(--bordo)] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-elettrico-500/50"
                aria-label={`Ingrandisci: ${foto.titolo}`}
              >
                {/* Segnaposto vettoriali: sostituibili con foto reali in public/galleria. */}
                <img
                  src={foto.file}
                  alt={foto.titolo}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-black/50 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-2 inline-block rounded-full bg-elettrico-600/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    {foto.categoria}
                  </span>
                  <span className="block text-sm font-bold text-white">{foto.titolo}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {ingrandita && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => impostaIngrandita(null)}
            role="dialog"
            aria-modal="true"
            aria-label={ingrandita.titolo}
          >
            <button
              type="button"
              onClick={() => impostaIngrandita(null)}
              aria-label="Chiudi"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.figure
              className="max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-notte-900"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(evento) => evento.stopPropagation()}
            >
              <img src={ingrandita.file} alt={ingrandita.titolo} width={800} height={600} className="w-full" />
              <figcaption className="p-6">
                <h3 className="text-lg font-bold text-white">{ingrandita.titolo}</h3>
                <p className="mt-2 text-sm text-[#9aa6c4]">{ingrandita.descrizione}</p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </Sezione>
  )
}
