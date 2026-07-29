import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Bozza di un modulo in compilazione.
 *
 * Il modulo di accettazione tiene i dati nello stato del componente: uscendo
 * dalla pagina — anche solo per controllare un prezzo o una scheda cliente —
 * React lo smonta e quanto si era scritto sparisce. Qui la bozza resta finché
 * non si salva o non si annulla.
 *
 * Due livelli, perché nessuno dei due basta da solo:
 *
 * - **in memoria**, completa: sopravvive al cambio di pagina dentro il
 *   gestionale, foto e firma comprese;
 * - **su disco** (`localStorage`), senza le immagini: sopravvive alla chiusura
 *   della scheda e al riavvio del browser. Le immagini restano fuori perché
 *   sono incorporate come dati (base64): una sola foto puo' pesare quanto
 *   tutto lo spazio disponibile, e il salvataggio fallirebbe portandosi dietro
 *   anche il testo — cioe' la parte che costa piu' fatica a riscrivere.
 *
 * Non e' un archivio. La riparazione vera viene scritta online al salvataggio;
 * questa e' solo una rete sotto al lavoro in corso, e si svuota appena il
 * modulo viene salvato o annullato.
 */

const PREFISSO = 'ioriparo:bozza:'

/** Oltre questo tempo la bozza e' roba dimenticata, non lavoro interrotto. */
const SCADENZA_MS = 24 * 60 * 60 * 1000

type Involucro<T> = { salvataAlle: number; dati: T }

/** Da dove e' stata ripresa la bozza: cambia cosa c'e' da dire all'utente. */
export type OrigineBozza = 'memoria' | 'disco' | null

/**
 * Copie complete, vive quanto la scheda del browser. Stanno fuori da React
 * apposta: devono sopravvivere allo smontaggio del componente, che e'
 * esattamente il momento in cui i dati andavano persi.
 */
const inMemoria = new Map<string, unknown>()

function leggiDaDisco<T>(chiave: string): T | null {
  try {
    const grezzo = localStorage.getItem(PREFISSO + chiave)
    if (!grezzo) return null
    const involucro = JSON.parse(grezzo) as Involucro<T>
    if (Date.now() - involucro.salvataAlle > SCADENZA_MS) {
      localStorage.removeItem(PREFISSO + chiave)
      return null
    }
    return involucro.dati
  } catch {
    // Bozza illeggibile o spazio non accessibile: si riparte dalle iniziali.
    return null
  }
}

export function useBozza<T extends object>(
  chiave: string,
  iniziali: T,
  /** Campi troppo pesanti per il disco: restano solo nella copia in memoria. */
  escludiDalDisco: (keyof T)[] = [],
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  { origine: OrigineBozza; scarta: () => void; ricomincia: () => void },
] {
  // Si legge una volta sola, all'apertura: rileggendo a ogni disegno la bozza
  // appena scritta tornerebbe indietro sopra a quello che si sta digitando.
  const [apertura] = useState<{ dati: T; origine: OrigineBozza }>(() => {
    const viva = inMemoria.get(chiave) as T | undefined
    if (viva) return { dati: viva, origine: 'memoria' }

    const daDisco = leggiDaDisco<T>(chiave)
    // Alla copia su disco mancano i campi esclusi: si completa con le iniziali.
    if (daDisco) return { dati: { ...iniziali, ...daDisco }, origine: 'disco' }

    return { dati: iniziali, origine: null }
  })

  const [dati, setDati] = useState<T>(apertura.dati)
  const [origine, setOrigine] = useState<OrigineBozza>(apertura.origine)

  // Riferimenti fermi: le liste e gli oggetti arrivano nuovi a ogni disegno e
  // farebbero ripartire gli effetti in continuazione.
  const esclusi = useRef(escludiDalDisco)
  const inizialiCorrenti = useRef(iniziali)
  useEffect(() => {
    inizialiCorrenti.current = iniziali
  })

  useEffect(() => {
    inMemoria.set(chiave, dati)
  }, [chiave, dati])

  useEffect(() => {
    // Scrittura ritardata: senza attesa si serializzerebbe tutto il modulo a
    // ogni tasto premuto.
    const attesa = setTimeout(() => {
      const magra = { ...dati }
      for (const campo of esclusi.current) delete magra[campo]
      try {
        localStorage.setItem(
          PREFISSO + chiave,
          JSON.stringify({ salvataAlle: Date.now(), dati: magra } satisfies Involucro<T>),
        )
      } catch {
        // Spazio esaurito o disco negato: la copia in memoria regge comunque
        // il cambio di pagina, che e' il caso di gran lunga piu' frequente.
      }
    }, 500)
    return () => clearTimeout(attesa)
  }, [chiave, dati])

  /** Il modulo e' stato salvato o abbandonato: la bozza non serve piu'. */
  const scarta = useCallback(() => {
    inMemoria.delete(chiave)
    try {
      localStorage.removeItem(PREFISSO + chiave)
    } catch {
      // Niente da fare: la copia in memoria e' comunque gia' sparita.
    }
  }, [chiave])

  /** Butta la bozza ripresa e riparte da com'era il modulo all'apertura. */
  const ricomincia = useCallback(() => {
    scarta()
    setDati(inizialiCorrenti.current)
    setOrigine(null)
  }, [scarta])

  return [dati, setDati, { origine, scarta, ricomincia }]
}
