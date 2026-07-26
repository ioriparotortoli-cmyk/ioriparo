import type { MetadataRoute } from 'next'
import { sito } from '@/lib/config/sito'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api/'] },
    ],
    sitemap: `${sito.url}/sitemap.xml`,
    host: sito.url,
  }
}
