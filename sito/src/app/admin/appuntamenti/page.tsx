import { Mail, MapPin, Phone } from 'lucide-react'
import {
  AvvisoConfigurazione,
  BottoneElimina,
  CambiaStato,
  Pannello,
  Vuoto,
} from '@/components/admin/comuni'
import { supabaseServer } from '@/lib/supabase/server'
import { aggiornaAppuntamento, eliminaAppuntamento } from '../azioni'
import { giorno } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const stati = ['richiesto', 'confermato', 'completato', 'annullato']

type Appuntamento = {
  id: string
  riferimento: string
  nome: string
  telefono: string
  email: string
  servizio: string
  data: string
  ora: string
  modalita: string
  note: string | null
  stato: string
}

export default async function PaginaAppuntamenti() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const oggi = new Date().toISOString().slice(0, 10)

  const { data } = await supabase
    .from('appuntamenti')
    .select('*')
    .order('data', { ascending: true })
    .order('ora', { ascending: true })
    .limit(200)

  const righe = (data ?? []) as Appuntamento[]
  const futuri = righe.filter((riga) => riga.data >= oggi)
  const passati = righe.filter((riga) => riga.data < oggi).reverse()

  const scheda = (riga: Appuntamento) => (
    <li key={riga.id}>
      <Pannello>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-elettrico-400">
              {riga.riferimento}
            </p>
            <h3 className="mt-1 text-lg font-bold">{riga.nome}</h3>
            <p className="mt-0.5 text-sm testo-tenue">{riga.servizio}</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold">{giorno(riga.data)}</p>
            <p className="text-sm testo-tenue">ore {riga.ora}</p>
          </div>

          <div className="flex items-center gap-2">
            <CambiaStato
              valore={riga.stato}
              opzioni={stati}
              azione={aggiornaAppuntamento.bind(null, riga.id)}
            />
            <BottoneElimina azione={eliminaAppuntamento.bind(null, riga.id)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 testo-tenue">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {riga.modalita}
          </span>
          <a href={`tel:${riga.telefono}`} className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {riga.telefono}
          </a>
          <a href={`mailto:${riga.email}`} className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {riga.email}
          </a>
        </div>

        {riga.note && (
          <p className="mt-4 whitespace-pre-line rounded-2xl superficie-alt px-4 py-3 text-sm">
            {riga.note}
          </p>
        )}
      </Pannello>
    </li>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Appuntamenti</h1>
        <p className="mt-1 text-sm testo-tenue">
          Prenotazioni ricevute dal sito: conferma, completa o annulla ogni slot.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider testo-tenue">In programma</h2>
        {futuri.length === 0 ? (
          <Vuoto testo="Nessun appuntamento futuro." />
        ) : (
          <ul className="space-y-4">{futuri.map(scheda)}</ul>
        )}
      </section>

      {passati.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider testo-tenue">Passati</h2>
          <ul className="space-y-4">{passati.slice(0, 20).map(scheda)}</ul>
        </section>
      )}
    </div>
  )
}
