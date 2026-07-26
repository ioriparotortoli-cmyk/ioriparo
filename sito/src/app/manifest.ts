import type { MetadataRoute } from 'next'
import { sito } from '@/lib/config/sito'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sito.nomeCompleto,
    short_name: sito.nome,
    description: sito.descrizione,
    start_url: '/',
    display: 'standalone',
    background_color: '#04060d',
    theme_color: '#2f6bff',
    lang: 'it-IT',
    icons: [
      { src: '/icona-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icona-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
