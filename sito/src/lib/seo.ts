import { sito } from '@/lib/config/sito'
import { faq } from '@/lib/dati/contenuti'
import { servizi } from '@/lib/dati/servizi'

/** Scheda LocalBusiness completa: indirizzo, orari, servizi e valutazione. */
export const schemaAttivita = () => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ComputerRepairService'],
  '@id': `${sito.url}/#attivita`,
  name: sito.nome,
  alternateName: sito.nomeCompleto,
  description: sito.descrizione,
  url: sito.url,
  telephone: sito.contatti.telefono,
  email: sito.contatti.email,
  image: `${sito.url}/og.png`,
  logo: `${sito.url}/logo.svg`,
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Contanti, Carte di credito, Bancomat, Bonifico',
  address: {
    '@type': 'PostalAddress',
    streetAddress: sito.indirizzo.via,
    postalCode: sito.indirizzo.cap,
    addressLocality: sito.indirizzo.citta,
    addressRegion: sito.indirizzo.provincia,
    addressCountry: sito.indirizzo.nazione,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: sito.indirizzo.latitudine,
    longitude: sito.indirizzo.longitudine,
  },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sito.indirizzo.completo)}`,
  openingHours: sito.orariStrutturati,
  areaServed: [
    { '@type': 'City', name: 'Tortolì' },
    { '@type': 'AdministrativeArea', name: 'Ogliastra' },
    { '@type': 'AdministrativeArea', name: 'Sardegna' },
  ],
  sameAs: [sito.social.facebook, sito.social.instagram, sito.google.profilo],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '48',
    bestRating: '5',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi di assistenza informatica',
    itemListElement: servizi.map((servizio) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: servizio.titolo,
        description: servizio.descrizione,
        serviceType: servizio.categoria,
      },
      ...(servizio.prezzoDa
        ? {
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: servizio.prezzoDa,
              priceCurrency: 'EUR',
              valueAddedTaxIncluded: true,
            },
          }
        : {}),
    })),
  },
})

export const schemaFaq = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((voce) => ({
    '@type': 'Question',
    name: voce.domanda,
    acceptedAnswer: { '@type': 'Answer', text: voce.risposta },
  })),
})

export const schemaSito = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${sito.url}/#sito`,
  url: sito.url,
  name: sito.nomeCompleto,
  inLanguage: 'it-IT',
  publisher: { '@id': `${sito.url}/#attivita` },
})

export const schemaBriciole = (voci: Array<{ nome: string; percorso: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: voci.map((voce, indice) => ({
    '@type': 'ListItem',
    position: indice + 1,
    name: voce.nome,
    item: `${sito.url}${voce.percorso}`,
  })),
})
