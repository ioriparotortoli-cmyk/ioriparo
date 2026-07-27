import { useCallback, useEffect, useRef, useState } from 'react'

/** Rispetta la preferenza di sistema per le animazioni ridotte. */
export const animazioniRidotte = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Aggiunge la classe `in` agli elementi `.reveal` contenuti nel nodo quando
 * entrano nell'area visibile: è così che il sito rivela i blocchi allo scorrimento.
 */
export function useRivela<T extends HTMLElement>() {
  const rif = useRef<T>(null)

  useEffect(() => {
    const radice = rif.current ?? document.body
    const nodi = [...radice.querySelectorAll<HTMLElement>('.reveal:not(.in)')]
    if (animazioniRidotte()) {
      nodi.forEach((n) => n.classList.add('in'))
      return
    }
    const osservatore = new IntersectionObserver(
      (voci) =>
        voci.forEach((v) => {
          if (!v.isIntersecting) return
          v.target.classList.add('in')
          osservatore.unobserve(v.target)
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px' },
    )
    nodi.forEach((n) => osservatore.observe(n))
    return () => osservatore.disconnect()
  })

  return rif
}

/** Conteggio animato da 0 al valore finale, avviato quando l'elemento è visibile. */
export function useContatore(valore: number, durata = 1600) {
  const rif = useRef<HTMLElement>(null)
  const [corrente, setCorrente] = useState(0)

  useEffect(() => {
    const nodo = rif.current
    if (!nodo) return
    if (animazioniRidotte()) {
      setCorrente(valore)
      return
    }
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (!voce.isIntersecting) return
        osservatore.disconnect()
        const avvio = performance.now()
        const passo = (ora: number) => {
          const k = Math.min(1, (ora - avvio) / durata)
          setCorrente(Math.round(valore * (1 - Math.pow(1 - k, 4))))
          if (k < 1) requestAnimationFrame(passo)
        }
        requestAnimationFrame(passo)
      },
      { threshold: 0.4 },
    )
    osservatore.observe(nodo)
    return () => osservatore.disconnect()
  }, [valore, durata])

  return [corrente, rif] as const
}

/** Chiude un pannello con il tasto Esc e riporta il fuoco a chi lo ha aperto. */
export function useEsc(attivo: boolean, chiudi: () => void) {
  useEffect(() => {
    if (!attivo) return
    const gestisci = (e: KeyboardEvent) => {
      if (e.key === 'Escape') chiudi()
    }
    document.addEventListener('keydown', gestisci)
    return () => document.removeEventListener('keydown', gestisci)
  }, [attivo, chiudi])
}

/** Valore persistito in `localStorage`, tollerante ai browser che lo bloccano. */
export function useMemoria(chiave: string, iniziale: string) {
  const [valore, setValore] = useState(() => {
    try {
      return localStorage.getItem(chiave) ?? iniziale
    } catch {
      return iniziale
    }
  })

  const aggiorna = useCallback(
    (nuovo: string) => {
      setValore(nuovo)
      try {
        localStorage.setItem(chiave, nuovo)
      } catch {
        /* modalità privata o storage disabilitato: si prosegue senza persistenza */
      }
    },
    [chiave],
  )

  return [valore, aggiorna] as const
}
