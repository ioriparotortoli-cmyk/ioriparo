import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { sito } from '@/lib/config/sito'
import { schemaAttivita, schemaSito } from '@/lib/seo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AzioniFlottanti } from '@/components/layout/AzioniFlottanti'
import { FornitoreTema } from '@/components/layout/FornitoreTema'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--carattere-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(sito.url),
  title: {
    default: 'Io Riparo — Riparazione Smartphone, Computer e Assistenza Informatica a Tortolì',
    template: `%s | ${sito.nome}`,
  },
  description: sito.descrizione,
  applicationName: sito.nome,
  keywords: [
    'riparazione smartphone Tortolì',
    'assistenza informatica Ogliastra',
    'riparazione computer Tortolì',
    'sostituzione display iPhone',
    'cambio batteria smartphone',
    'recupero dati',
    'rimozione virus',
    'assemblaggio PC gaming',
    'videosorveglianza Tortolì',
    'reti aziendali Sardegna',
  ],
  authors: [{ name: sito.nome, url: sito.url }],
  creator: sito.nome,
  publisher: sito.nome,
  alternates: { canonical: '/' },
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: sito.url,
    siteName: sito.nome,
    title: 'Io Riparo — Riparazione Smartphone, Computer e Assistenza Informatica',
    description: sito.descrizione,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Io Riparo — centro assistenza informatica a Tortolì',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Io Riparo — Riparazione Smartphone, Computer e Assistenza Informatica',
    description: sito.descrizione,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    'geo.region': 'IT-NU',
    'geo.placename': sito.indirizzo.citta,
    'geo.position': `${sito.indirizzo.latitudine};${sito.indirizzo.longitudine}`,
    ICBM: `${sito.indirizzo.latitudine}, ${sito.indirizzo.longitudine}`,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#04060d' },
  ],
  colorScheme: 'dark light',
}

/** Applica il tema salvato prima del primo paint per evitare lo sfarfallio. */
const scriptTema = `(function(){try{var t=localStorage.getItem('ioriparo-tema');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" data-theme="dark" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAttivita()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSito()) }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <FornitoreTema>
          <a
            href="#contenuto"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-elettrico-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Vai al contenuto
          </a>
          <Header />
          <main id="contenuto">{children}</main>
          <Footer />
          <AzioniFlottanti />
        </FornitoreTema>
      </body>
    </html>
  )
}
