import { useEffect } from 'react'
import { AZIENDA, INDIRIZZO_COMPLETO, ORARI, TELEFONO_E164 } from '../dati/azienda'

export const SITO_URL = 'https://www.ioriparo.it'

interface Seo {
  titolo: string
  descrizione: string
  /** Percorso senza dominio, es. `/servizi` */
  percorso: string
  immagine?: string
  tipo?: 'website' | 'article'
  /** Dati strutturati aggiuntivi (Article, FAQPage, …) */
  datiStrutturati?: Record<string, unknown> | Record<string, unknown>[]
}

function meta(selettore: string, attributo: 'name' | 'property', valore: string, contenuto: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selettore)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attributo, valore)
    document.head.append(tag)
  }
  tag.content = contenuto
}

function link(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.rel = rel
    document.head.append(tag)
  }
  tag.href = href
}

/** Scheda Schema.org dell'attività, inclusa in ogni pagina. */
export const SCHEMA_ATTIVITA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITO_URL}/#attivita`,
  name: AZIENDA.nome,
  description: AZIENDA.descrizione,
  url: SITO_URL,
  telephone: TELEFONO_E164,
  email: AZIENDA.email,
  image: `${SITO_URL}/marchio/io-riparo-logo.png`,
  logo: `${SITO_URL}/marchio/io-riparo-logo.png`,
  priceRange: '€€',
  vatID: AZIENDA.partitaIva,
  address: {
    '@type': 'PostalAddress',
    streetAddress: AZIENDA.indirizzo,
    postalCode: AZIENDA.cap,
    addressLocality: AZIENDA.citta,
    addressRegion: AZIENDA.provincia,
    addressCountry: 'IT',
  },
  areaServed: [AZIENDA.citta, 'Ogliastra', 'Provincia di Nuoro', 'Sardegna'],
  openingHoursSpecification: ORARI.filter((o) => o.fasce.length).flatMap((o) =>
    o.fasce.map(([da, a]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][o.indice]}`,
      opens: ora(da),
      closes: ora(a),
    })),
  ),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '214' },
}

function ora(v: number) {
  const h = Math.floor(v)
  return `${String(h).padStart(2, '0')}:${String(Math.round((v - h) * 60)).padStart(2, '0')}`
}

/**
 * Applica titolo, meta description, canonical, Open Graph, Twitter Card
 * e dati strutturati della pagina corrente.
 */
export function useSeo({ titolo, descrizione, percorso, immagine, tipo = 'website', datiStrutturati }: Seo) {
  useEffect(() => {
    const url = SITO_URL + percorso
    const og = immagine ?? `${SITO_URL}/marchio/social.png`

    document.title = titolo
    meta('meta[name="description"]', 'name', 'description', descrizione)
    meta('meta[property="og:title"]', 'property', 'og:title', titolo)
    meta('meta[property="og:description"]', 'property', 'og:description', descrizione)
    meta('meta[property="og:type"]', 'property', 'og:type', tipo)
    meta('meta[property="og:url"]', 'property', 'og:url', url)
    meta('meta[property="og:image"]', 'property', 'og:image', og)
    meta('meta[property="og:site_name"]', 'property', 'og:site_name', AZIENDA.nome)
    meta('meta[property="og:locale"]', 'property', 'og:locale', 'it_IT')
    meta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    meta('meta[name="twitter:title"]', 'name', 'twitter:title', titolo)
    meta('meta[name="twitter:description"]', 'name', 'twitter:description', descrizione)
    meta('meta[name="twitter:image"]', 'name', 'twitter:image', og)
    link('canonical', url)

    const dati = [SCHEMA_ATTIVITA, ...(datiStrutturati ? [datiStrutturati].flat() : [])]
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'pagina'
    script.textContent = JSON.stringify(dati)
    document.head.append(script)
    return () => script.remove()
  }, [titolo, descrizione, percorso, immagine, tipo, datiStrutturati])
}

/** Briciole di pane in formato Schema.org. */
export const briciole = (voci: { nome: string; percorso: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: voci.map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: v.nome,
    item: SITO_URL + v.percorso,
  })),
})

export const INDIRIZZO_SEO = INDIRIZZO_COMPLETO
