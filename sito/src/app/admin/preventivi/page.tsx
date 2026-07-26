import { Mail, Phone } from 'lucide-react'
import {
  AvvisoConfigurazione,
  BottoneElimina,
  CambiaStato,
  Pannello,
  Vuoto,
} from '@/components/admin/comuni'
import { supabaseServer } from '@/lib/supabase/server'
import { aggiornaPreventivo, eliminaPreventivo } from '../azioni'
import { dataOra, euro } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const stati = ['nuovo', 'inviato', 'accettato', 'rifiutato', 'completato']

type Preventivo = {
  id: string
  riferimento: string
  nome: string
  telefono: string
  email: string
  dispositivo: string
  servizio: string | null
  problema: string
  foto: string[] | null
  stato: string
  prezzo: number | null
  creato_il: string
}

export default async function PaginaPreventivi() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const { data, error } = await supabase
    .from('preventivi')
    .select('*')
    .order('creato_il', { ascending: false })
    .limit(100)

  const righe = (data ?? []) as Preventivo[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Preventivi</h1>
        <p className="mt-1 text-sm testo-tenue">
          Richieste arrivate dal sito, con foto del dispositivo e stato di lavorazione.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error.message}
        </p>
      )}

      {righe.length === 0 ? (
        <Vuoto testo="Nessuna richiesta di preventivo ricevuta." />
      ) : (
        <ul className="space-y-4">
          {righe.map((riga) => (
            <li key={riga.id}>
              <Pannello>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-elettrico-400">
                      {riga.riferimento} · {dataOra(riga.creato_il)}
                    </p>
                    <h2 className="mt-1 text-lg font-bold">
                      {riga.nome} — {riga.dispositivo}
                    </h2>
                    <p className="mt-0.5 text-sm testo-tenue">
                      {riga.servizio ?? 'Servizio da valutare'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CambiaStato
                      valore={riga.stato}
                      opzioni={stati}
                      azione={aggiornaPreventivo.bind(null, riga.id)}
                    />
                    <BottoneElimina azione={eliminaPreventivo.bind(null, riga.id)} />
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-line rounded-2xl superficie-alt px-4 py-3 text-sm leading-relaxed">
                  {riga.problema}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <a href={`tel:${riga.telefono}`} className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {riga.telefono}
                  </a>
                  <a href={`mailto:${riga.email}`} className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {riga.email}
                  </a>
                  {riga.prezzo != null && (
                    <span className="font-semibold">Preventivato: {euro(riga.prezzo)}</span>
                  )}
                </div>

                {riga.foto && riga.foto.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {riga.foto.map((url) => (
                      <li key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {/* Foto caricate dai clienti su Supabase Storage. */}
                          <img
                            src={url}
                            alt="Foto del dispositivo"
                            className="h-24 w-24 rounded-2xl border border-[color:var(--bordo)] object-cover transition-transform hover:scale-105"
                            loading="lazy"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Pannello>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
