import { useState } from 'react'
import { FAQ, type Domanda } from '../dati/contenuti'
import { cn } from '../lib/utili'
import { Icona } from './Icona'

/** Elenco a fisarmonica: resta aperta una sola domanda alla volta. */
export function Faq({ voci = FAQ, className }: { voci?: Domanda[]; className?: string }) {
  const [aperta, setAperta] = useState<number | null>(0)

  return (
    <div className={cn('faq reveal', className)}>
      {voci.map((v, i) => (
        <div className={cn('faq__i', aperta === i && 'is-open')} key={v.domanda}>
          <button
            className="faq__q"
            aria-expanded={aperta === i}
            onClick={() => setAperta(aperta === i ? null : i)}
          >
            <span>{v.domanda}</span>
            <Icona nome="plus" dimensione={18} />
          </button>
          <div className="faq__a">
            <div>
              <p>{v.risposta}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Dati strutturati per la scheda "Domande frequenti" nei risultati di ricerca. */
export const schemaFaq = (voci: Domanda[] = FAQ) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: voci.map((v) => ({
    '@type': 'Question',
    name: v.domanda,
    acceptedAnswer: { '@type': 'Answer', text: v.risposta },
  })),
})
