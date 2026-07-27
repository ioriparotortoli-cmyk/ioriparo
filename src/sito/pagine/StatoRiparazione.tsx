import { useState, type FormEvent } from 'react'
import { useGestionale } from '@/data/store'
import type { Riparazione } from '@/types'
import { useNotifica } from '../componenti/Notifiche'
import { SchedaPratica } from '../componenti/SchedaPratica'
import { Avviso, Bottone, Intestazione, LinkBottone, Sezione } from '../componenti/base'
import { AZIENDA, TELEFONO_E164 } from '../dati/azienda'
import { useRivela } from '../lib/hook'
import { briciole, useSeo } from '../lib/seo'

/** Confronto tollerante: `#26-0007`, `26-0007` e `260007` sono lo stesso codice. */
const normalizza = (v: string) => v.toUpperCase().replace(/[^0-9A-Z]/g, '')

export function StatoRiparazione() {
  const rif = useRivela<HTMLDivElement>()
  const { db } = useGestionale()
  const notifica = useNotifica()

  const [codice, setCodice] = useState('')
  const [risultato, setRisultato] = useState<Riparazione | null>(null)
  const [errore, setErrore] = useState<string | null>(null)

  useSeo({
    titolo: 'Stato riparazione — traccia la tua pratica | Io Riparo',
    descrizione:
      'Inserisci il codice pratica della tua riparazione e scopri a che punto siamo: diagnosi, preventivo, lavorazione, collaudo e ritiro, aggiornati in tempo reale.',
    percorso: '/stato-riparazione',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Stato riparazione', percorso: '/stato-riparazione' },
    ]),
  })

  const cerca = (valore: string) => {
    const richiesto = normalizza(valore)
    if (!richiesto) {
      setErrore('Inserisci il codice pratica che trovi sulla ricevuta di accettazione.')
      setRisultato(null)
      return
    }
    const trovata = db.riparazioni.find((r) => normalizza(r.codice) === richiesto)
    setRisultato(trovata ?? null)
    setErrore(
      trovata
        ? null
        : `Nessuna pratica trovata con il codice ${valore.toUpperCase()}. Controlla la ricevuta oppure chiamaci al ${AZIENDA.telefono}.`,
    )
  }

  const invia = (e: FormEvent) => {
    e.preventDefault()
    cerca(codice)
  }

  return (
    <div ref={rif}>
      <Sezione griglia>
        <div className="wrap" style={{ maxWidth: 820, padding: 0 }}>
          <Intestazione
            occhiello="Stato riparazione"
          principale
            titolo="Dov'è il mio dispositivo?"
            testo="Inserisci il codice pratica che trovi sulla ricevuta di accettazione o nella e-mail di conferma."
          />

          <div className="card reveal">
            <form onSubmit={invia} noValidate>
              <div className="row" style={{ gap: 10, alignItems: 'flex-end' }}>
                <div className="field" style={{ flex: 1, minWidth: 220, margin: 0 }}>
                  <label htmlFor="codice">Codice pratica</label>
                  <input
                    className="inp mono"
                    id="codice"
                    value={codice}
                    onChange={(e) => setCodice(e.target.value)}
                    placeholder="#26-0001"
                    autoComplete="off"
                    required
                  />
                </div>
                <Bottone type="submit">Verifica stato</Bottone>
              </div>
            </form>

            <p className="faint" style={{ fontSize: '.79rem', marginTop: 12 }}>
              Il codice si trova sulla ricevuta di accettazione, nel formato <span className="mono">#26-0001</span>.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <Avviso variante="err" visibile={!!errore}>
              {errore}
            </Avviso>

            {risultato && (
              <>
                <SchedaPratica riparazione={risultato} />
                <div className="row" style={{ marginTop: 16 }}>
                  <LinkBottone a={`tel:${TELEFONO_E164}`} variante="ghost" piccolo>
                    Serve aiuto? Chiamaci
                  </LinkBottone>
                  <Bottone
                    variante="soft"
                    piccolo
                    onClick={() => notifica('Ti avviseremo via e-mail a ogni cambio di stato.')}
                  >
                    Ricevi aggiornamenti
                  </Bottone>
                </div>
              </>
            )}
          </div>
        </div>
      </Sezione>
    </div>
  )
}
