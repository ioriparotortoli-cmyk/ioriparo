import { Hero } from '@/components/sezioni/Hero'
import { Servizi } from '@/components/sezioni/Servizi'
import { Perche } from '@/components/sezioni/Perche'
import { ComeLavoriamo } from '@/components/sezioni/ComeLavoriamo'
import { Recensioni } from '@/components/sezioni/Recensioni'
import { Galleria } from '@/components/sezioni/Galleria'
import { DomandeFrequenti } from '@/components/sezioni/DomandeFrequenti'
import { Contatti } from '@/components/sezioni/Contatti'
import { RichiamoFinale } from '@/components/sezioni/RichiamoFinale'
import { Offerte } from '@/components/sezioni/Offerte'
import { caricaServizi } from '@/lib/dati/serviziRemoti'
import { schemaFaq } from '@/lib/seo'

// Rigenerazione oraria: pagina servita statica, contenuti sempre aggiornati.
export const revalidate = 3600

export default async function Home() {
  const elencoServizi = await caricaServizi()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq()) }}
      />
      <Hero />
      <Offerte />
      <Servizi elenco={elencoServizi} />
      <Perche />
      <ComeLavoriamo />
      <Recensioni />
      <Galleria />
      <DomandeFrequenti />
      <RichiamoFinale />
      <Contatti />
    </>
  )
}
