import type { MetadataRoute } from 'next'
import { sito } from '@/lib/config/sito'

export default function sitemap(): MetadataRoute.Sitemap {
  const aggiornato = new Date()

  return [
    { url: sito.url, lastModified: aggiornato, changeFrequency: 'weekly', priority: 1 },
    { url: `${sito.url}/preventivo`, lastModified: aggiornato, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${sito.url}/prenota`, lastModified: aggiornato, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${sito.url}/privacy-policy`, lastModified: aggiornato, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${sito.url}/cookie-policy`, lastModified: aggiornato, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
