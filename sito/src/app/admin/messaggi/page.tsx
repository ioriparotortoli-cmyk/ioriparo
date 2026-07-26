import { Mail, Phone } from 'lucide-react'
import {
  AvvisoConfigurazione,
  BottoneElimina,
  CambiaStato,
  Pannello,
  Vuoto,
} from '@/components/admin/comuni'
import { supabaseServer } from '@/lib/supabase/server'
import { aggiornaMessaggio, eliminaMessaggio } from '../azioni'
import { dataOra } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const stati = ['nuovo', 'letto', 'completato']

type Messaggio = {
  id: string
  nome: string
  email: string
  telefono: string | null
  messaggio: string
  stato: string
  creato_il: string
}

export default async function PaginaMessaggi() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const { data } = await supabase
    .from('messaggi')
    .select('*')
    .order('creato_il', { ascending: false })
    .limit(100)

  const righe = (data ?? []) as Messaggio[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Messaggi</h1>
        <p className="mt-1 text-sm testo-tenue">Richieste arrivate dal modulo contatti della home.</p>
      </div>

      {righe.length === 0 ? (
        <Vuoto testo="Nessun messaggio ricevuto." />
      ) : (
        <ul className="space-y-4">
          {righe.map((riga) => (
            <li key={riga.id}>
              <Pannello>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold">{riga.nome}</h2>
                    <p className="text-xs testo-tenue">{dataOra(riga.creato_il)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CambiaStato
                      valore={riga.stato}
                      opzioni={stati}
                      azione={aggiornaMessaggio.bind(null, riga.id)}
                    />
                    <BottoneElimina azione={eliminaMessaggio.bind(null, riga.id)} />
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-line rounded-2xl superficie-alt px-4 py-3 text-sm leading-relaxed">
                  {riga.messaggio}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <a href={`mailto:${riga.email}`} className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {riga.email}
                  </a>
                  {riga.telefono && (
                    <a href={`tel:${riga.telefono}`} className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {riga.telefono}
                    </a>
                  )}
                </div>
              </Pannello>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
