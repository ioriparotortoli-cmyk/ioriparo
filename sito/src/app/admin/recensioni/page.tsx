import { Star } from 'lucide-react'
import { AvvisoConfigurazione, BottoneElimina, ModuloAzione, Pannello, Vuoto } from '@/components/admin/comuni'
import { Campo } from '@/components/moduli/campi'
import { supabaseServer } from '@/lib/supabase/server'
import { eliminaRecensione, salvaRecensione } from '../azioni'
import { sito } from '@/lib/config/sito'

export const dynamic = 'force-dynamic'

type RigaRecensione = {
  id: string
  autore: string
  testo: string
  valutazione: number
  dispositivo: string | null
  data_testo: string | null
  pubblicata: boolean
}

function CampiRecensione({ riga }: { riga?: RigaRecensione }) {
  const chiave = riga?.id ?? 'nuova'

  return (
    <>
      {riga && <input type="hidden" name="id" value={riga.id} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <Campo etichetta="Autore" nome={`autore-${chiave}`} obbligatorio>
          <input id={`autore-${chiave}`} name="autore" className="campo" defaultValue={riga?.autore} required maxLength={60} />
        </Campo>
        <Campo etichetta="Valutazione" nome={`valutazione-${chiave}`}>
          <select id={`valutazione-${chiave}`} name="valutazione" className="campo" defaultValue={String(riga?.valutazione ?? 5)}>
            {[5, 4, 3, 2, 1].map((voto) => (
              <option key={voto} value={voto}>
                {voto} stelle
              </option>
            ))}
          </select>
        </Campo>
        <Campo etichetta="Dispositivo" nome={`dispositivo-${chiave}`}>
          <input
            id={`dispositivo-${chiave}`}
            name="dispositivo"
            className="campo"
            defaultValue={riga?.dispositivo ?? ''}
            maxLength={60}
          />
        </Campo>
      </div>

      <Campo etichetta="Testo" nome={`testo-${chiave}`} obbligatorio>
        <textarea
          id={`testo-${chiave}`}
          name="testo"
          rows={3}
          className="campo resize-y"
          defaultValue={riga?.testo}
          required
          maxLength={600}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Data (testo)" nome={`data-${chiave}`} suggerimento="Es. 2 settimane fa">
          <input id={`data-${chiave}`} name="data_testo" className="campo" defaultValue={riga?.data_testo ?? ''} maxLength={40} />
        </Campo>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            name="pubblicata"
            defaultChecked={riga?.pubblicata ?? true}
            className="h-4 w-4 accent-[#2f6bff]"
          />
          Visibile sul sito
        </label>
      </div>
    </>
  )
}

export default async function PaginaRecensioni() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const { data } = await supabase.from('recensioni').select('*').order('creata_il', { ascending: false })
  const righe = (data ?? []) as RigaRecensione[]

  const google = Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Recensioni</h1>
        <p className="mt-1 text-sm testo-tenue">
          {google
            ? 'L’integrazione Google Places è attiva: il sito mostra le recensioni reali della scheda Google e usa queste solo come riserva.'
            : 'Integrazione Google Places non configurata: il sito mostra le recensioni pubblicate qui.'}
        </p>
      </div>

      <Pannello
        titolo="Nuova recensione"
        descrizione="Utile per riportare recensioni ricevute a voce o su altri canali."
        azione={
          <a
            href={sito.google.profilo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-elettrico-400 hover:underline"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            Apri la scheda Google
          </a>
        }
      >
        <ModuloAzione azione={salvaRecensione} etichetta="Aggiungi recensione" reimposta>
          <CampiRecensione />
        </ModuloAzione>
      </Pannello>

      {righe.length === 0 ? (
        <Vuoto testo="Nessuna recensione salvata: il sito usa quelle predefinite." />
      ) : (
        <ul className="space-y-4">
          {righe.map((riga) => (
            <li key={riga.id}>
              <Pannello
                titolo={`${riga.autore} — ${riga.valutazione}★`}
                descrizione={[riga.dispositivo, riga.data_testo, riga.pubblicata ? 'pubblicata' : 'nascosta']
                  .filter(Boolean)
                  .join(' · ')}
                azione={<BottoneElimina azione={eliminaRecensione.bind(null, riga.id)} />}
              >
                <p className="text-sm leading-relaxed testo-tenue">“{riga.testo}”</p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-elettrico-400">
                    Modifica
                  </summary>
                  <div className="mt-5">
                    <ModuloAzione azione={salvaRecensione} etichetta="Salva modifiche">
                      <CampiRecensione riga={riga} />
                    </ModuloAzione>
                  </div>
                </details>
              </Pannello>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
