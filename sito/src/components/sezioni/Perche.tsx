import { IntestazioneSezione, Sezione } from '@/components/ui/Sezione'
import { Rivela } from '@/components/ui/Rivela'
import { vantaggi } from '@/lib/dati/contenuti'
import { icone } from '@/lib/icone'

export function Perche() {
  return (
    <Sezione id="perche" sfondoAlternato>
      <IntestazioneSezione
        occhiello="Perché sceglierci"
        titolo={
          <>
            Perché scegliere <span className="testo-gradiente">Io Riparo</span>
          </>
        }
        sottotitolo="Trasparenza sui costi, tempi certi e ricambi selezionati: la riparazione è un servizio, non una scommessa."
      />

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vantaggi.map((vantaggio, indice) => {
          const Icona = icone[vantaggio.icona]
          return (
            <Rivela as="li" key={vantaggio.titolo} ritardo={indice * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-[color:var(--bordo)] bg-[color:var(--superficie)] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-elettrico-500/50">
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-elettrico-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-elettrico-500/12 ring-1 ring-elettrico-500/25">
                  <Icona className="h-6 w-6 text-elettrico-400" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{vantaggio.titolo}</h3>
                <p className="mt-2 text-sm leading-relaxed testo-tenue">{vantaggio.descrizione}</p>
              </div>
            </Rivela>
          )
        })}
      </ul>
    </Sezione>
  )
}
