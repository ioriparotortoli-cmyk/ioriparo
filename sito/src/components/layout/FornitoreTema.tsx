'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Tema = 'dark' | 'light'

type ContestoTema = {
  tema: Tema
  cambiaTema: () => void
}

const Contesto = createContext<ContestoTema>({ tema: 'dark', cambiaTema: () => {} })

const CHIAVE = 'ioriparo-tema'

export function FornitoreTema({ children }: { children: React.ReactNode }) {
  const [tema, impostaTema] = useState<Tema>('dark')

  // Allinea lo stato React al tema già applicato dallo script inline.
  useEffect(() => {
    const attuale = document.documentElement.getAttribute('data-theme')
    impostaTema(attuale === 'light' ? 'light' : 'dark')
  }, [])

  const cambiaTema = useCallback(() => {
    impostaTema((precedente) => {
      const successivo: Tema = precedente === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', successivo)
      try {
        localStorage.setItem(CHIAVE, successivo)
      } catch {
        // Storage non disponibile (navigazione privata): il tema resta per la sessione.
      }
      return successivo
    })
  }, [])

  return <Contesto.Provider value={{ tema, cambiaTema }}>{children}</Contesto.Provider>
}

export const useTema = () => useContext(Contesto)
