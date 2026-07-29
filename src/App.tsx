import { Suspense } from 'react'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { GestionaleProvider } from '@/data/store'
import { SitoLayout } from '@/sito/SitoLayout'
import { Home } from '@/sito/pagine/Home'

/**
 * Su hosting statico senza riscrittura degli URL (anteprime, GitHub Pages)
 * si compila con `VITE_ROUTER=hash` e la navigazione passa dal fragment.
 */
const creaRouter = import.meta.env.VITE_ROUTER === 'hash' ? createHashRouter : createBrowserRouter

/**
 * Ogni pagina è un modulo separato: la home pubblica non scarica il codice del
 * gestionale (e viceversa), così il primo caricamento resta leggero.
 */
const pagina = (carica: () => Promise<Record<string, unknown>>, esporta: string) => async () => ({
  Component: (await carica())[esporta] as React.ComponentType,
})

/**
 * Il gestionale entra nella build solo con `VITE_GESTIONALE=1`. Mostra i dati
 * dell'attività, quindi non deve finire per sbaglio in una build del sito: chi
 * lo vuole online lo chiede esplicitamente, e a quel punto `AppLayout` pretende
 * l'accesso con le credenziali dell'archivio online.
 */
const conGestionale = import.meta.env.VITE_GESTIONALE === '1' && import.meta.env.VITE_ANTEPRIMA !== '1'

const rotteGestionale = !conGestionale
  ? []
  : [
      {
        path: '/gestionale',
        lazy: pagina(() => import('@/components/layout/AppLayout'), 'AppLayout'),
        children: [
          { index: true, lazy: pagina(() => import('@/pages/Dashboard'), 'Dashboard') },

          { path: 'clienti', lazy: pagina(() => import('@/pages/clienti/ClientiList'), 'ClientiList') },
          { path: 'clienti/:id', lazy: pagina(() => import('@/pages/clienti/DettaglioCliente'), 'DettaglioCliente') },

          { path: 'riparazioni', lazy: pagina(() => import('@/pages/riparazioni/RiparazioniList'), 'RiparazioniList') },
          { path: 'riparazioni/nuova', lazy: pagina(() => import('@/pages/riparazioni/NuovaRiparazione'), 'NuovaRiparazione') },
          { path: 'riparazioni/:id', lazy: pagina(() => import('@/pages/riparazioni/DettaglioRiparazione'), 'DettaglioRiparazione') },
          {
            path: 'riparazioni/:id/modifica',
            lazy: pagina(() => import('@/pages/riparazioni/ModificaRiparazione'), 'ModificaRiparazione'),
          },

          { path: 'richieste', lazy: pagina(() => import('@/pages/Richieste'), 'Richieste') },
          { path: 'preventivi', lazy: pagina(() => import('@/pages/Preventivi'), 'Preventivi') },
          { path: 'fatture', lazy: pagina(() => import('@/pages/Fatture'), 'Fatture') },
          { path: 'magazzino', lazy: pagina(() => import('@/pages/Magazzino'), 'Magazzino') },
          { path: 'ordini', lazy: pagina(() => import('@/pages/OrdiniFornitori'), 'OrdiniFornitori') },
          { path: 'scadenze', lazy: pagina(() => import('@/pages/Scadenze'), 'Scadenze') },
          { path: 'impianti', lazy: pagina(() => import('@/pages/Impianti'), 'Impianti') },
          { path: 'statistiche', lazy: pagina(() => import('@/pages/Statistiche'), 'Statistiche') },
          { path: 'profilo', lazy: pagina(() => import('@/pages/Profilo'), 'Profilo') },
          { path: 'impostazioni', lazy: pagina(() => import('@/pages/Impostazioni'), 'Impostazioni') },
          { path: 'backup', lazy: pagina(() => import('@/pages/Backup'), 'Backup') },

          { path: '*', lazy: pagina(() => import('@/pages/NonTrovata'), 'NonTrovata') },
        ],
      },
    ]

const router = creaRouter([
  /* ─── Sito pubblico ─── */
  {
    path: '/',
    element: <SitoLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'chi-siamo', lazy: pagina(() => import('@/sito/pagine/ChiSiamo'), 'ChiSiamo') },
      { path: 'servizi', lazy: pagina(() => import('@/sito/pagine/Servizi'), 'Servizi') },
      { path: 'servizi/:id', lazy: pagina(() => import('@/sito/pagine/Servizio'), 'Servizio') },
      { path: 'galleria', lazy: pagina(() => import('@/sito/pagine/GalleriaPagina'), 'GalleriaPagina') },
      { path: 'blog', lazy: pagina(() => import('@/sito/pagine/Blog'), 'Blog') },
      { path: 'blog/:slug', lazy: pagina(() => import('@/sito/pagine/Blog'), 'PaginaArticolo') },
      { path: 'contatti', lazy: pagina(() => import('@/sito/pagine/Contatti'), 'Contatti') },
      { path: 'preventivo', lazy: pagina(() => import('@/sito/pagine/Preventivo'), 'Preventivo') },
      { path: 'prenota', lazy: pagina(() => import('@/sito/pagine/Prenota'), 'Prenota') },
      { path: 'stato-riparazione', lazy: pagina(() => import('@/sito/pagine/StatoRiparazione'), 'StatoRiparazione') },
      { path: 'area-clienti', lazy: pagina(() => import('@/sito/pagine/AreaClienti'), 'AreaClienti') },
      { path: 'privacy', lazy: pagina(() => import('@/sito/pagine/Legali'), 'Privacy') },
      { path: 'cookie-policy', lazy: pagina(() => import('@/sito/pagine/Legali'), 'CookiePolicy') },
      { path: 'mappa-del-sito', lazy: pagina(() => import('@/sito/pagine/Legali'), 'MappaSito') },
      { path: '*', lazy: pagina(() => import('@/sito/pagine/Legali'), 'NonTrovata') },
    ],
  },

  ...rotteGestionale,
])

export function App() {
  return (
    <GestionaleProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </GestionaleProvider>
  )
}
