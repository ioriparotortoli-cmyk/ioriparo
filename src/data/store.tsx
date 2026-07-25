import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { creaDatabaseIniziale } from './seed'
import type {
  ArticoloMagazzino,
  Azienda,
  Cliente,
  DatabaseGestionale,
  Fattura,
  Impianto,
  OrdineFornitore,
  Preventivo,
  Riparazione,
  Scadenza,
} from '@/types'

const CHIAVE_STORAGE = 'ioriparo:db:v1'

/** Genera un identificativo locale (nessun backend: basta unicità in sessione). */
export function nuovoId(prefisso: string): string {
  return `${prefisso}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function caricaDatabase(): DatabaseGestionale {
  const iniziale = creaDatabaseIniziale()
  if (typeof window === 'undefined') return iniziale

  try {
    const grezzo = window.localStorage.getItem(CHIAVE_STORAGE)
    if (!grezzo) return iniziale
    const salvato = JSON.parse(grezzo) as Partial<DatabaseGestionale>
    // Merge superficiale: le collezioni mancanti tornano al dato demo.
    return { ...iniziale, ...salvato, azienda: { ...iniziale.azienda, ...salvato.azienda } }
  } catch {
    return iniziale
  }
}

interface ContestoGestionale {
  db: DatabaseGestionale

  aggiungiCliente: (cliente: Omit<Cliente, 'id' | 'creatoIl'>) => Cliente
  aggiornaCliente: (id: string, modifiche: Partial<Cliente>) => void
  eliminaCliente: (id: string) => void

  aggiungiRiparazione: (
    riparazione: Omit<Riparazione, 'id' | 'codice'> & { codice?: string },
  ) => Riparazione
  aggiornaRiparazione: (id: string, modifiche: Partial<Riparazione>) => void
  eliminaRiparazione: (id: string) => void

  aggiornaPreventivo: (id: string, modifiche: Partial<Preventivo>) => void
  aggiornaFattura: (id: string, modifiche: Partial<Fattura>) => void

  aggiungiArticolo: (articolo: Omit<ArticoloMagazzino, 'id'>) => ArticoloMagazzino
  aggiornaArticolo: (id: string, modifiche: Partial<ArticoloMagazzino>) => void
  eliminaArticolo: (id: string) => void

  aggiornaOrdine: (id: string, modifiche: Partial<OrdineFornitore>) => void

  aggiungiScadenza: (scadenza: Omit<Scadenza, 'id'>) => Scadenza
  aggiornaScadenza: (id: string, modifiche: Partial<Scadenza>) => void
  eliminaScadenza: (id: string) => void

  aggiornaImpianto: (id: string, modifiche: Partial<Impianto>) => void
  aggiornaAzienda: (modifiche: Partial<Azienda>) => void

  /** Ripristina i dati dimostrativi scartando le modifiche locali. */
  ripristinaDemo: () => void
  /** Sostituisce l'intero archivio (import di un backup). */
  importaDatabase: (db: DatabaseGestionale) => void

  clientePerId: (id: string) => Cliente | undefined
  /** Prossimo codice riparazione disponibile, es. `#24-0025`. */
  prossimoCodice: () => string
}

const Contesto = createContext<ContestoGestionale | null>(null)

export function GestionaleProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DatabaseGestionale>(caricaDatabase)

  useEffect(() => {
    try {
      window.localStorage.setItem(CHIAVE_STORAGE, JSON.stringify(db))
    } catch {
      // Quota superata o storage non disponibile: si prosegue solo in memoria.
    }
  }, [db])

  /** Applica una modifica parziale all'elemento con `id` di una collezione. */
  const aggiornaIn = useCallback(
    <C extends keyof DatabaseGestionale, T extends { id: string }>(
      collezione: C,
      id: string,
      modifiche: Partial<T>,
    ) => {
      setDb((precedente) => ({
        ...precedente,
        [collezione]: (precedente[collezione] as unknown as T[]).map((voce) =>
          voce.id === id ? { ...voce, ...modifiche } : voce,
        ),
      }))
    },
    [],
  )

  const eliminaDa = useCallback(
    <C extends keyof DatabaseGestionale>(collezione: C, id: string) => {
      setDb((precedente) => ({
        ...precedente,
        [collezione]: (precedente[collezione] as unknown as { id: string }[]).filter(
          (voce) => voce.id !== id,
        ),
      }))
    },
    [],
  )

  const prossimoCodice = useCallback(() => {
    const progressivi = db.riparazioni
      .map((r) => Number.parseInt(r.codice.split('-')[1] ?? '0', 10))
      .filter((n) => !Number.isNaN(n))
    const prossimo = (progressivi.length ? Math.max(...progressivi) : 0) + 1
    return `${db.azienda.prefissoCodice}${String(prossimo).padStart(4, '0')}`
  }, [db.riparazioni, db.azienda.prefissoCodice])

  const valore = useMemo<ContestoGestionale>(
    () => ({
      db,

      aggiungiCliente: (cliente) => {
        const nuovo: Cliente = {
          ...cliente,
          id: nuovoId('cli'),
          creatoIl: new Date().toISOString().slice(0, 10),
        }
        setDb((p) => ({ ...p, clienti: [nuovo, ...p.clienti] }))
        return nuovo
      },
      aggiornaCliente: (id, modifiche) => aggiornaIn('clienti', id, modifiche),
      eliminaCliente: (id) => eliminaDa('clienti', id),

      aggiungiRiparazione: (riparazione) => {
        const nuova: Riparazione = {
          ...riparazione,
          id: nuovoId('rip'),
          codice: riparazione.codice ?? prossimoCodice(),
        }
        setDb((p) => ({ ...p, riparazioni: [nuova, ...p.riparazioni] }))
        return nuova
      },
      aggiornaRiparazione: (id, modifiche) => aggiornaIn('riparazioni', id, modifiche),
      eliminaRiparazione: (id) => eliminaDa('riparazioni', id),

      aggiornaPreventivo: (id, modifiche) => aggiornaIn('preventivi', id, modifiche),
      aggiornaFattura: (id, modifiche) => aggiornaIn('fatture', id, modifiche),

      aggiungiArticolo: (articolo) => {
        const nuovo: ArticoloMagazzino = { ...articolo, id: nuovoId('art') }
        setDb((p) => ({ ...p, magazzino: [nuovo, ...p.magazzino] }))
        return nuovo
      },
      aggiornaArticolo: (id, modifiche) => aggiornaIn('magazzino', id, modifiche),
      eliminaArticolo: (id) => eliminaDa('magazzino', id),

      aggiornaOrdine: (id, modifiche) => aggiornaIn('ordini', id, modifiche),

      aggiungiScadenza: (scadenza) => {
        const nuova: Scadenza = { ...scadenza, id: nuovoId('sca') }
        setDb((p) => ({ ...p, scadenze: [nuova, ...p.scadenze] }))
        return nuova
      },
      aggiornaScadenza: (id, modifiche) => aggiornaIn('scadenze', id, modifiche),
      eliminaScadenza: (id) => eliminaDa('scadenze', id),

      aggiornaImpianto: (id, modifiche) => aggiornaIn('impianti', id, modifiche),
      aggiornaAzienda: (modifiche) =>
        setDb((p) => ({ ...p, azienda: { ...p.azienda, ...modifiche } })),

      ripristinaDemo: () => {
        window.localStorage.removeItem(CHIAVE_STORAGE)
        setDb(creaDatabaseIniziale())
      },
      importaDatabase: (nuovoDb) => setDb(nuovoDb),

      clientePerId: (id) => db.clienti.find((c) => c.id === id),
      prossimoCodice,
    }),
    [db, aggiornaIn, eliminaDa, prossimoCodice],
  )

  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>
}

export function useGestionale(): ContestoGestionale {
  const contesto = useContext(Contesto)
  if (!contesto) {
    throw new Error('useGestionale deve essere usato dentro <GestionaleProvider>')
  }
  return contesto
}
