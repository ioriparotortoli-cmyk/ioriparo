'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { Rivela } from '@/components/ui/Rivela'
import { BottoneLink } from '@/components/ui/Bottone'
import { faq } from '@/lib/dati/contenuti'
import { linkWhatsapp } from '@/lib/config/sito'

export function DomandeFrequenti() {
  const [aperta, impostaAperta] = useState<number | null>(0)

  return (
    <Sezione id="faq" sfondoAlternato>
      <IntestazioneSezione
        occhiello="Domande frequenti"
        titolo={
          <>
            Le risposte alle domande <span className="testo-gradiente">più comuni</span>
          </>
        }
        sottotitolo="Costi, tempi, dati e garanzia: quello che ci chiedono ogni giorno al banco."
      />

      <ul className="mx-auto max-w-3xl space-y-3">
        {faq.map((voce, indice) => {
          const attiva = aperta === indice
          return (
            <Rivela as="li" key={voce.domanda} ritardo={indice * 0.05}>
              <div
                className={`overflow-hidden rounded-3xl border transition-colors duration-300 ${
                  attiva
                    ? 'border-elettrico-500/50 bg-elettrico-500/[0.06]'
                    : 'border-[color:var(--bordo)] bg-[color:var(--superficie)]'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={`domanda-${indice}`}
                    onClick={() => impostaAperta(attiva ? null : indice)}
                    aria-expanded={attiva}
                    aria-controls={`risposta-${indice}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[1.02rem] font-semibold">{voce.domanda}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-elettrico-400 transition-transform duration-300 ${
                        attiva ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {/* Il pannello resta sempre nel DOM: così `aria-controls` punta a
                    un elemento reale, le risposte sono indicizzabili e coerenti
                    con i dati strutturati FAQPage. Quando è chiuso viene reso
                    inerte, quindi né leggibile dagli screen reader né tabulabile. */}
                <motion.div
                  id={`risposta-${indice}`}
                  role="region"
                  aria-labelledby={`domanda-${indice}`}
                  inert={!attiva}
                  initial={false}
                  animate={{ height: attiva ? 'auto' : 0, opacity: attiva ? 1 : 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm leading-relaxed testo-tenue">{voce.risposta}</p>
                </motion.div>
              </div>
            </Rivela>
          )
        })}
      </ul>

      <Rivela className="mx-auto mt-10 max-w-3xl rounded-3xl vetro p-7 text-center">
        <p className="text-base font-semibold">Non hai trovato la tua risposta?</p>
        <p className="mt-2 text-sm testo-tenue">
          Scrivici su WhatsApp con marca, modello e problema: ti diciamo subito costi e tempi.
        </p>
        <BottoneLink href={linkWhatsapp} variante="whatsapp" className="mt-5">
          Scrivici su WhatsApp
        </BottoneLink>
      </Rivela>
    </Sezione>
  )
}
