import { useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { IntestazioneProvider } from './intestazione'
import { Accesso } from '@/components/Accesso'
import { useGestionale } from '@/data/store'

export function AppLayout() {
  const [menuAperto, setMenuAperto] = useState(false)
  const { sorgente } = useGestionale()

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

  return (
    <IntestazioneProvider>
      <div className="min-h-screen bg-base">
        <Sidebar aperta={menuAperto} onChiudi={() => setMenuAperto(false)} />

        <div className="lg:pl-64">
          <Topbar onApriMenu={() => setMenuAperto(true)} />
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>

        <ScrollRestoration />
      </div>
    </IntestazioneProvider>
  )
}
