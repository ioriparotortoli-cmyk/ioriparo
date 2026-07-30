import { useEffect, useState } from 'react'
import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { IntestazioneProvider } from './intestazione'
import { Accesso } from '@/components/Accesso'
import { datiAziendaMancanti } from '@/data/seed'
import { useGestionale } from '@/data/store'
import { archivioOnline } from '@/lib/supabase'

/**
 * In locale il gestionale può lavorare sull'archivio del browser: è il modo in
 * cui si prova senza database. In rete no: lì l'unico accesso è quello vero.
 */
const inLocale = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)

/**
 * Il gestionale è nella build ma l'archivio online non è configurato: senza
 * database non esiste accesso, quindi la porta resta chiusa. Meglio una pagina
 * che dice cosa manca, che un gestionale aperto a chiunque.
 */
function ArchivioMancante() {
  return (
    <div className="grid min-h-screen place-items-center bg-base p-6">
      <div className="max-w-md rounded-card border border-line bg-surface p-5 text-center">
        <h1 className="text-[15px] font-semibold text-ink">Gestionale non disponibile</h1>
        <p className="mt-2 text-sm text-ink-muted">
          L’archivio online non è configurato, quindi non c’è modo di verificare chi sta entrando.
          Il gestionale resta chiuso finché il collegamento non è attivo.
        </p>
        <p className="mt-3 text-xs text-ink-faint">
          Da sistemare: le variabili <span className="font-mono">VITE_SUPABASE_URL</span> e{' '}
          <span className="font-mono">VITE_SUPABASE_ANON_KEY</span> devono essere impostate
          nell’hosting, e il sito va ricompilato dopo averle aggiunte.
        </p>
      </div>
    </div>
  )
}

/**
 * Aggiungendo la pagina alla schermata Home, iPhone e Android non usano
 * l'indirizzo aperto in quel momento ma quello dichiarato dal sito. Con un
 * manifesto solo per il sito pubblico, l'icona del gestionale finiva per
 * aprire la home: dentro al gestionale si dichiara quindi il suo.
 */
function useManifestoGestionale() {
  useEffect(() => {
    const tag = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
    if (!tag) return
    const precedente = tag.getAttribute('href')
    tag.setAttribute('href', '/gestionale.webmanifest')
    return () => {
      if (precedente) tag.setAttribute('href', precedente)
    }
  }, [])
}

/**
 * Su un archivio appena creato i dati dell'attività sono vuoti, e senza quelli
 * un documento stampato non vale niente: manca chi lo emette. L'avviso resta
 * finché non sono compilati — non si può chiudere, perché chiuderlo non
 * risolve, e un preventivo stampato senza partita IVA è un problema vero.
 */
function DatiDaCompilare({ mancanti }: { mancanti: string[] }) {
  return (
    <div
      role="alert"
      className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200 lg:px-6"
    >
      <strong className="font-semibold">Manca ancora qualcosa sulla tua attività:</strong>{' '}
      {mancanti.join(', ')}. Finché non li compili, i documenti stampati escono senza intestazione.{' '}
      <Link to="/gestionale/impostazioni" className="font-semibold underline underline-offset-2">
        Vai alle impostazioni
      </Link>
    </div>
  )
}

export function AppLayout() {
  const [menuAperto, setMenuAperto] = useState(false)
  const { db, sorgente } = useGestionale()
  useManifestoGestionale()

  // Un gestionale pubblicato senza archivio online non ha alcun accesso da
  // superare: mostrerebbe i dati dell'attività a chiunque conosca l'indirizzo.
  if (!archivioOnline && !inLocale) return <ArchivioMancante />

  // Con l'archivio online il gestionale si apre solo dopo l'accesso: i dati
  // dell'attività non sono visibili a chi arriva sull'indirizzo.
  if (sorgente === 'accesso-richiesto') return <Accesso />

  if (sorgente === 'caricamento') {
    return (
      <div className="grid min-h-screen place-items-center bg-base text-ink-muted">
        <p className="flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Carico l’archivio…
        </p>
      </div>
    )
  }

  const mancanti = datiAziendaMancanti(db.azienda)

  return (
    <IntestazioneProvider>
      <div className="min-h-screen bg-base">
        <Sidebar aperta={menuAperto} onChiudi={() => setMenuAperto(false)} />

        <div className="lg:pl-64">
          <Topbar onApriMenu={() => setMenuAperto(true)} />
          {mancanti.length > 0 && <DatiDaCompilare mancanti={mancanti} />}
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>

        <ScrollRestoration />
      </div>
    </IntestazioneProvider>
  )
}
