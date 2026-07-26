import { AvvisoConfigurazione, BottoneElimina, ModuloAzione, Pannello, Vuoto } from '@/components/admin/comuni'
import { Campo } from '@/components/moduli/campi'
import { supabaseServer } from '@/lib/supabase/server'
import { eliminaOfferta, salvaOfferta } from '../azioni'
import { giorno } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type RigaOfferta = {
  id: string
  titolo: string
  descrizione: string
  sconto: string | null
  valida_fino: string | null
  immagine: string | null
  pubblicata: boolean
}

function CampiOfferta({ riga }: { riga?: RigaOfferta }) {
  const chiave = riga?.id ?? 'nuova'

  return (
    <>
      {riga && <input type="hidden" name="id" value={riga.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Titolo" nome={`titolo-${chiave}`} obbligatorio>
          <input id={`titolo-${chiave}`} name="titolo" className="campo" defaultValue={riga?.titolo} required maxLength={80} />
        </Campo>
        <Campo etichetta="Etichetta sconto" nome={`sconto-${chiave}`} suggerimento="Es. -20% o 2x1">
          <input id={`sconto-${chiave}`} name="sconto" className="campo" defaultValue={riga?.sconto ?? ''} maxLength={24} />
        </Campo>
      </div>

      <Campo etichetta="Descrizione" nome={`descrizione-${chiave}`}>
        <textarea
          id={`descrizione-${chiave}`}
          name="descrizione"
          rows={2}
          className="campo resize-y"
          defaultValue={riga?.descrizione}
          maxLength={240}
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Valida fino al" nome={`valida-${chiave}`}>
          <input
            id={`valida-${chiave}`}
            name="valida_fino"
            type="date"
            className="campo"
            defaultValue={riga?.valida_fino ?? ''}
          />
        </Campo>
        <Campo etichetta="URL immagine" nome={`immagine-${chiave}`} suggerimento="Copiala dalla sezione Immagini.">
          <input id={`immagine-${chiave}`} name="immagine" className="campo" defaultValue={riga?.immagine ?? ''} />
        </Campo>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="pubblicata"
          defaultChecked={riga?.pubblicata ?? true}
          className="h-4 w-4 accent-[#2f6bff]"
        />
        Pubblicata in home
      </label>
    </>
  )
}

export default async function PaginaOfferte() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const { data } = await supabase.from('offerte').select('*').order('creata_il', { ascending: false })
  const righe = (data ?? []) as RigaOfferta[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Offerte</h1>
        <p className="mt-1 text-sm testo-tenue">
          Le promozioni pubblicate compaiono in cima alla home, sotto l’intestazione.
        </p>
      </div>

      <Pannello titolo="Nuova offerta">
        <ModuloAzione azione={salvaOfferta} etichetta="Pubblica offerta" reimposta>
          <CampiOfferta />
        </ModuloAzione>
      </Pannello>

      {righe.length === 0 ? (
        <Vuoto testo="Nessuna offerta creata." />
      ) : (
        <ul className="space-y-4">
          {righe.map((riga) => (
            <li key={riga.id}>
              <Pannello
                titolo={riga.titolo}
                descrizione={[
                  riga.pubblicata ? 'pubblicata' : 'bozza',
                  riga.sconto,
                  riga.valida_fino ? `fino al ${giorno(riga.valida_fino)}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                azione={<BottoneElimina azione={eliminaOfferta.bind(null, riga.id)} />}
              >
                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-elettrico-400">
                    Modifica
                  </summary>
                  <div className="mt-5">
                    <ModuloAzione azione={salvaOfferta} etichetta="Salva modifiche">
                      <CampiOfferta riga={riga} />
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
