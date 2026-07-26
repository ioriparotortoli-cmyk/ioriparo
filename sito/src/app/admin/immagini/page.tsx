import { AvvisoConfigurazione, ModuloAzione, Pannello, Vuoto } from '@/components/admin/comuni'
import { CopiaUrl } from '@/components/admin/CopiaUrl'
import { Campo } from '@/components/moduli/campi'
import { BottoneElimina } from '@/components/admin/comuni'
import { supabaseServer } from '@/lib/supabase/server'
import { BUCKET_MEDIA } from '@/lib/supabase/config'
import { caricaImmagine, eliminaImmagine } from '../azioni'

export const dynamic = 'force-dynamic'

const cartelle = ['galleria', 'offerte', 'servizi']

export default async function PaginaImmagini() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const elenchi = await Promise.all(
    cartelle.map(async (cartella) => {
      const { data } = await supabase.storage
        .from(BUCKET_MEDIA)
        .list(cartella, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

      return {
        cartella,
        file: (data ?? [])
          .filter((voce) => voce.id !== null)
          .map((voce) => {
            const percorso = `${cartella}/${voce.name}`
            return {
              percorso,
              nome: voce.name,
              url: supabase.storage.from(BUCKET_MEDIA).getPublicUrl(percorso).data.publicUrl,
            }
          }),
      }
    }),
  )

  const totale = elenchi.reduce((somma, gruppo) => somma + gruppo.file.length, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Immagini</h1>
        <p className="mt-1 text-sm testo-tenue">
          Archivio su Supabase Storage (bucket <code>{BUCKET_MEDIA}</code>): carica le foto e copia
          l’URL da usare nelle offerte o nella galleria.
        </p>
      </div>

      <Pannello titolo="Carica una nuova immagine">
        <ModuloAzione azione={caricaImmagine} etichetta="Carica" reimposta>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etichetta="Cartella" nome="cartella">
              <select id="cartella" name="cartella" className="campo" defaultValue="galleria">
                {cartelle.map((cartella) => (
                  <option key={cartella} value={cartella}>
                    {cartella}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo etichetta="File" nome="file" obbligatorio suggerimento="JPG, PNG o WEBP fino a 8 MB.">
              <input id="file" name="file" type="file" accept="image/*" className="campo" required />
            </Campo>
          </div>
        </ModuloAzione>
      </Pannello>

      {totale === 0 ? (
        <Vuoto testo="Nessuna immagine caricata." />
      ) : (
        elenchi
          .filter((gruppo) => gruppo.file.length > 0)
          .map((gruppo) => (
            <Pannello key={gruppo.cartella} titolo={gruppo.cartella}>
              <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {gruppo.file.map((file) => (
                  <li
                    key={file.percorso}
                    className="overflow-hidden rounded-2xl border border-[color:var(--bordo)]"
                  >
                    {/* Anteprima diretta dallo storage. */}
                    <img src={file.url} alt={file.nome} className="aspect-square w-full object-cover" loading="lazy" />
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="min-w-0 flex-1 truncate text-xs testo-tenue" title={file.nome}>
                        {file.nome}
                      </span>
                      <CopiaUrl url={file.url} />
                      <BottoneElimina
                        azione={eliminaImmagine.bind(null, file.percorso)}
                        conferma={`Eliminare ${file.nome}?`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Pannello>
          ))
      )}
    </div>
  )
}
