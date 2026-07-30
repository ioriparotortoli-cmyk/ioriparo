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
import {
  eliminaVoce,
  salvaImpostazioni,
  salvaVoce,
  scaricaArchivio,
  type Elenco,
} from './archivio'
import { archivioOnline, supabase } from '@/lib/supabase'
import type {
  ArticoloMagazzino,
  Azienda,
  Cliente,
  DatabaseGestionale,
  Fattura,
  Impianto,
  OrdineFornitore,
  PreferenzeUtente,
  Preventivo,
  Riparazione,
  Scadenza,
  Utente,
} from '@/types'

const CHIAVE_STORAGE = 'gestionale:db:v1'

/**
 * Caratteri per la parte casuale del codice pratica: niente O/0, I/1, S/5,
 * così non ci sono errori quando il codice viene letto al telefono o ricopiato
 * dalla ricevuta.
 */
const ALFABETO = 'ACDEFHJKLMNPQRTUVWXYZ2346789'

/**
 * Coda casuale del codice pratica.
 *
 * Il progressivo da solo (`#26-0007`) è indovinabile: chiunque potrebbe
 * scorrere i numeri sulla pagina «Stato riparazione» e vedere dispositivo e
 * stato di lavorazione di tutti i clienti. Con tre caratteri casuali il codice
 * resta corto e leggibile, ma tentare a caso non porta da nessuna parte.
 */
function suffissoCasuale(lunghezza = 3): string {
  const valori = new Uint32Array(lunghezza)
  crypto.getRandomValues(valori)
  return Array.from(valori, (v) => ALFABETO[v % ALFABETO.length]).join('')
}

/** Genera un identificativo locale (nessun backend: basta unicità in sessione). */
export function nuovoId(prefisso: string): string {
  return `${prefisso}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Vero se in questo browser c'è davvero un archivio salvato.
 *
 * Serve prima di trasferire i dati online: senza questo controllo, da un
 * computer che non ha mai usato il gestionale si finirebbe per caricare
 * nell'archivio vero i clienti e le riparazioni di esempio.
 */
export function esisteArchivioLocale(): boolean {
  try {
    return Boolean(window.localStorage.getItem(CHIAVE_STORAGE))
  } catch {
    return false
  }
}

/**
 * L'archivio salvato nel browser di questo dispositivo. Serve anche al
 * passaggio all'archivio online, per non lasciare indietro il lavoro già fatto.
 */
export function caricaDatabase(): DatabaseGestionale {
  const iniziale = creaDatabaseIniziale()
  if (typeof window === 'undefined') return iniziale

  try {
    const grezzo = window.localStorage.getItem(CHIAVE_STORAGE)
    if (!grezzo) return iniziale
    const salvato = JSON.parse(grezzo) as Partial<DatabaseGestionale>
    // Merge superficiale: le collezioni mancanti tornano al dato demo.
    // Azienda e utente si fondono campo per campo, così un archivio salvato
    // prima che esistessero queste voci non resta senza valori.
    return {
      ...iniziale,
      ...salvato,
      azienda: { ...iniziale.azienda, ...salvato.azienda },
      utente: {
        ...iniziale.utente,
        ...salvato.utente,
        preferenze: { ...iniziale.utente.preferenze, ...salvato.utente?.preferenze },
      },
    }
  } catch {
    return iniziale
  }
}

/** Dove stanno i dati in questo momento. */
export type Sorgente = 'locale' | 'online' | 'caricamento' | 'accesso-richiesto'

interface ContestoGestionale {
  db: DatabaseGestionale
  /** `locale` = archivio del browser; `online` = archivio condiviso. */
  sorgente: Sorgente
  /** Rilegge tutto dall'archivio online. */
  ricarica: () => Promise<void>

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
  aggiornaUtente: (modifiche: Partial<Utente>) => void
  aggiornaPreferenze: (modifiche: Partial<PreferenzeUtente>) => void

  /** Ripristina i dati dimostrativi scartando le modifiche locali. */
  ripristinaDemo: () => void
  /** Sostituisce l'intero archivio (import di un backup). */
  importaDatabase: (db: DatabaseGestionale) => void

  clientePerId: (id: string) => Cliente | undefined
  /** Prossimo codice riparazione disponibile, es. `#26-0025-K7M`. */
  prossimoCodice: () => string
}

const Contesto = createContext<ContestoGestionale | null>(null)

export function GestionaleProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DatabaseGestionale>(caricaDatabase)
  const [sorgente, setSorgente] = useState<Sorgente>(archivioOnline ? 'caricamento' : 'locale')

  /**
   * Con l'archivio online i dati arrivano dal database, ma solo dopo
   * l'accesso: le tabelle sono chiuse a chi non è autenticato. Finché non si
   * entra, il gestionale mostra l'archivio locale e non scrive online.
   */
  const ricarica = useCallback(async () => {
    if (!archivioOnline || !supabase) return
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setSorgente('accesso-richiesto')
      return
    }
    setSorgente('caricamento')
    try {
      setDb(await scaricaArchivio())
      setSorgente('online')
    } catch {
      setSorgente('accesso-richiesto')
    }
  }, [])

  useEffect(() => {
    if (!archivioOnline || !supabase) return
    void ricarica()
    const { data } = supabase.auth.onAuthStateChange(() => void ricarica())
    return () => data.subscription.unsubscribe()
  }, [ricarica])

  useEffect(() => {
    // L'archivio locale resta la copia di lavoro finché non si è online.
    if (sorgente === 'online') return
    try {
      window.localStorage.setItem(CHIAVE_STORAGE, JSON.stringify(db))
    } catch {
      // Quota superata o storage non disponibile: si prosegue solo in memoria.
    }
  }, [db, sorgente])

  /** Riflette online una modifica già applicata allo stato locale. */
  const rifletti = useCallback(
    (azione: () => Promise<void>) => {
      if (sorgente !== 'online') return
      void azione().catch((e) => console.error('archivio online:', e))
    },
    [sorgente],
  )

  /**
   * Applica una modifica parziale all'elemento con `id` di una collezione.
   *
   * La voce aggiornata si conosce solo dentro l'aggiornamento di stato, quindi
   * è da lì che parte la copia online. La scrittura è un `upsert`: ripeterla
   * non cambia il risultato.
   */
  const aggiornaIn = useCallback(
    <C extends Elenco, T extends { id: string }>(
      collezione: C,
      id: string,
      modifiche: Partial<T>,
    ) => {
      setDb((precedente) => ({
        ...precedente,
        [collezione]: (precedente[collezione] as unknown as T[]).map((voce) => {
          if (voce.id !== id) return voce
          const aggiornata = { ...voce, ...modifiche }
          rifletti(() => salvaVoce(collezione, aggiornata))
          return aggiornata
        }),
      }))
    },
    [rifletti],
  )

  const eliminaDa = useCallback(
    (collezione: Elenco, id: string) => {
      setDb((precedente) => ({
        ...precedente,
        [collezione]: (precedente[collezione] as unknown as { id: string }[]).filter(
          (voce) => voce.id !== id,
        ),
      }))
      rifletti(() => eliminaVoce(collezione, id))
    },
    [rifletti],
  )

  const prossimoCodice = useCallback(() => {
    const progressivi = db.riparazioni
      .map((r) => Number.parseInt(r.codice.split('-')[1] ?? '0', 10))
      .filter((n) => !Number.isNaN(n))
    const prossimo = (progressivi.length ? Math.max(...progressivi) : 0) + 1
    return `${db.azienda.prefissoCodice}${String(prossimo).padStart(4, '0')}-${suffissoCasuale()}`
  }, [db.riparazioni, db.azienda.prefissoCodice])

  const valore = useMemo<ContestoGestionale>(
    () => ({
      db,
      sorgente,
      ricarica,

      aggiungiCliente: (cliente) => {
        const nuovo: Cliente = {
          ...cliente,
          id: nuovoId('cli'),
          creatoIl: new Date().toISOString().slice(0, 10),
        }
        setDb((p) => ({ ...p, clienti: [nuovo, ...p.clienti] }))
        rifletti(() => salvaVoce('clienti', nuovo))
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
        rifletti(() => salvaVoce('riparazioni', nuova))
        return nuova
      },
      aggiornaRiparazione: (id, modifiche) => aggiornaIn('riparazioni', id, modifiche),
      eliminaRiparazione: (id) => eliminaDa('riparazioni', id),

      aggiornaPreventivo: (id, modifiche) => aggiornaIn('preventivi', id, modifiche),
      aggiornaFattura: (id, modifiche) => aggiornaIn('fatture', id, modifiche),

      aggiungiArticolo: (articolo) => {
        const nuovo: ArticoloMagazzino = { ...articolo, id: nuovoId('art') }
        setDb((p) => ({ ...p, magazzino: [nuovo, ...p.magazzino] }))
        rifletti(() => salvaVoce('magazzino', nuovo))
        return nuovo
      },
      aggiornaArticolo: (id, modifiche) => aggiornaIn('magazzino', id, modifiche),
      eliminaArticolo: (id) => eliminaDa('magazzino', id),

      aggiornaOrdine: (id, modifiche) => aggiornaIn('ordini', id, modifiche),

      aggiungiScadenza: (scadenza) => {
        const nuova: Scadenza = { ...scadenza, id: nuovoId('sca') }
        setDb((p) => ({ ...p, scadenze: [nuova, ...p.scadenze] }))
        rifletti(() => salvaVoce('scadenze', nuova))
        return nuova
      },
      aggiornaScadenza: (id, modifiche) => aggiornaIn('scadenze', id, modifiche),
      eliminaScadenza: (id) => eliminaDa('scadenze', id),

      aggiornaImpianto: (id, modifiche) => aggiornaIn('impianti', id, modifiche),
      aggiornaAzienda: (modifiche) =>
        setDb((p) => {
          const azienda = { ...p.azienda, ...modifiche }
          rifletti(() => salvaImpostazioni('azienda', azienda))
          return { ...p, azienda }
        }),
      aggiornaUtente: (modifiche) =>
        setDb((p) => {
          const utente = { ...p.utente, ...modifiche }
          rifletti(() => salvaImpostazioni('utente', utente))
          return { ...p, utente }
        }),
      aggiornaPreferenze: (modifiche) =>
        setDb((p) => {
          const utente = { ...p.utente, preferenze: { ...p.utente.preferenze, ...modifiche } }
          rifletti(() => salvaImpostazioni('utente', utente))
          return { ...p, utente }
        }),

      ripristinaDemo: () => {
        window.localStorage.removeItem(CHIAVE_STORAGE)
        setDb(creaDatabaseIniziale())
      },
      importaDatabase: (nuovoDb) => setDb(nuovoDb),

      clientePerId: (id) => db.clienti.find((c) => c.id === id),
      prossimoCodice,
    }),
    [db, sorgente, ricarica, rifletti, aggiornaIn, eliminaDa, prossimoCodice],
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
