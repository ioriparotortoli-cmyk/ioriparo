import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { VoceBriciola } from '@/components/ui/PageHeader'

export interface Intestazione {
  titolo: string
  sottotitolo?: string
  briciole?: VoceBriciola[]
}

interface ContestoIntestazione {
  intestazione: Intestazione
  setIntestazione: (intestazione: Intestazione) => void
}

const Contesto = createContext<ContestoIntestazione | null>(null)

const PREDEFINITA: Intestazione = { titolo: 'IO RIPARO' }

export function IntestazioneProvider({ children }: { children: ReactNode }) {
  const [intestazione, setIntestazione] = useState<Intestazione>(PREDEFINITA)
  const valore = useMemo(() => ({ intestazione, setIntestazione }), [intestazione])
  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>
}

export function useIntestazioneCorrente(): Intestazione {
  return useContext(Contesto)?.intestazione ?? PREDEFINITA
}

/**
 * Imposta titolo, sottotitolo e briciole mostrati nella barra superiore.
 * Da chiamare una volta per pagina.
 */
export function useIntestazione(intestazione: Intestazione) {
  const contesto = useContext(Contesto)
  // Le briciole sono ricreate a ogni render: si confronta la forma serializzata.
  const impronta = JSON.stringify(intestazione)

  useEffect(() => {
    contesto?.setIntestazione(JSON.parse(impronta) as Intestazione)
    document.title = `${intestazione.titolo} · IO RIPARO`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impronta])
}
