import { AvvisoConfigurazione, BottoneElimina, ModuloAzione, Pannello, Vuoto } from '@/components/admin/comuni'
import { Campo } from '@/components/moduli/campi'
import { supabaseServer } from '@/lib/supabase/server'
import { eliminaServizio, salvaServizio } from '../azioni'
import { icone } from '@/lib/icone'
import { categorieServizi } from '@/lib/dati/servizi'
import { euro } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type RigaServizio = {
  id: string
  slug: string
  titolo: string
  descrizione: string
  icona: string
  categoria: string
  prezzo_da: number | null
  tempi: string
  attivo: boolean
  ordine: number | null
}

const categorie = categorieServizi.filter((voce) => voce !== 'Tutti')

function CampiServizio({ riga }: { riga?: RigaServizio }) {
  const chiave = riga?.id ?? 'nuovo'

  return (
    <>
      {riga && <input type="hidden" name="id" value={riga.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Titolo" nome={`titolo-${chiave}`} obbligatorio>
          <input id={`titolo-${chiave}`} name="titolo" className="campo" defaultValue={riga?.titolo} required maxLength={80} />
        </Campo>
        <Campo etichetta="Slug" nome={`slug-${chiave}`} suggerimento="Lascia vuoto per generarlo dal titolo.">
          <input id={`slug-${chiave}`} name="slug" className="campo" defaultValue={riga?.slug} maxLength={80} />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Campo etichetta="Categoria" nome={`categoria-${chiave}`}>
          <select id={`categoria-${chiave}`} name="categoria" className="campo" defaultValue={riga?.categoria ?? 'Riparazioni'}>
            {categorie.map((voce) => (
              <option key={voce} value={voce}>
                {voce}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etichetta="Icona" nome={`icona-${chiave}`}>
          <select id={`icona-${chiave}`} name="icona" className="campo" defaultValue={riga?.icona ?? 'ricambi'}>
            {Object.keys(icone).map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etichetta="Prezzo da (€)" nome={`prezzo-${chiave}`} suggerimento="Vuoto = su preventivo">
          <input
            id={`prezzo-${chiave}`}
            name="prezzo_da"
            type="number"
            min={0}
            step={1}
            className="campo"
            defaultValue={riga?.prezzo_da ?? ''}
          />
        </Campo>

        <Campo etichetta="Tempi" nome={`tempi-${chiave}`}>
          <input id={`tempi-${chiave}`} name="tempi" className="campo" defaultValue={riga?.tempi} maxLength={40} />
        </Campo>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="attivo" defaultChecked={riga?.attivo ?? true} className="h-4 w-4 accent-[#1792d1]" />
          Visibile sul sito
        </label>
        <label className="flex items-center gap-2 text-sm">
          Ordine
          <input
            name="ordine"
            type="number"
            min={0}
            className="campo w-24 py-1.5"
            defaultValue={riga?.ordine ?? ''}
          />
        </label>
      </div>
    </>
  )
}

export default async function PaginaServizi() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const { data } = await supabase
    .from('servizi')
    .select('*')
    .order('ordine', { ascending: true, nullsFirst: false })

  const righe = (data ?? []) as RigaServizio[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Servizi e prezzi</h1>
        <p className="mt-1 text-sm testo-tenue">
          I servizi salvati qui sostituiscono il catalogo predefinito della home. Se la tabella è
          vuota il sito mostra il catalogo statico.
        </p>
      </div>

      <Pannello titolo="Nuovo servizio">
        <ModuloAzione azione={salvaServizio} etichetta="Aggiungi servizio" reimposta>
          <CampiServizio />
        </ModuloAzione>
      </Pannello>

      {righe.length === 0 ? (
        <Vuoto testo="Nessun servizio personalizzato: la home usa il catalogo predefinito." />
      ) : (
        <ul className="space-y-4">
          {righe.map((riga) => (
            <li key={riga.id}>
              <Pannello
                titolo={riga.titolo}
                descrizione={`${riga.categoria} · ${riga.prezzo_da ? `da ${euro(riga.prezzo_da)}` : 'su preventivo'} · ${riga.tempi}${riga.attivo ? '' : ' · nascosto'}`}
                azione={<BottoneElimina azione={eliminaServizio.bind(null, riga.id)} />}
              >
                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-elettrico-400">
                    Modifica
                  </summary>
                  <div className="mt-5">
                    <ModuloAzione azione={salvaServizio} etichetta="Salva modifiche">
                      <CampiServizio riga={riga} />
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
