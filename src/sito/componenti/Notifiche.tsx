import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { Icona } from './Icona'

interface Notifica {
  id: number
  testo: string
}

const Contesto = createContext<(testo: string) => void>(() => {})

/** Messaggi temporanei in fondo alla pagina (conferme di invio, azioni riuscite). */
export function ProviderNotifiche({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Notifica[]>([])

  const notifica = useCallback((testo: string) => {
    const id = Date.now() + Math.random()
    setLista((p) => [...p, { id, testo }])
    setTimeout(() => setLista((p) => p.filter((n) => n.id !== id)), 3600)
  }, [])

  const valore = useMemo(() => notifica, [notifica])

  return (
    <Contesto.Provider value={valore}>
      {children}
      <div className="toasts" aria-live="polite">
        {lista.map((n) => (
          <div className="toast" key={n.id}>
            <Icona nome="check" dimensione={16} />
            <span>{n.testo}</span>
          </div>
        ))}
      </div>
    </Contesto.Provider>
  )
}

export const useNotifica = () => useContext(Contesto)
