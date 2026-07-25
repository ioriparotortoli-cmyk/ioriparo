import { useMemo, useState } from 'react'

/**
 * Ordinamento e paginazione condivisi da tutte le liste del gestionale.
 * Il filtraggio resta a carico della pagina, che passa già gli elementi filtrati.
 */
export function useElenco<T>(
  elementi: T[],
  {
    perPaginaIniziale = 10,
    ordinamentoIniziale,
  }: {
    perPaginaIniziale?: number
    ordinamentoIniziale?: { campo: keyof T & string; direzione: 'asc' | 'desc' }
  } = {},
) {
  const [pagina, setPagina] = useState(1)
  const [perPagina, setPerPagina] = useState(perPaginaIniziale)
  const [ordinamento, setOrdinamento] = useState(ordinamentoIniziale)

  const ordinati = useMemo(() => {
    if (!ordinamento) return elementi
    const { campo, direzione } = ordinamento
    return [...elementi].sort((a, b) => {
      const valoreA = a[campo]
      const valoreB = b[campo]
      if (valoreA === valoreB) return 0
      if (valoreA === undefined) return 1
      if (valoreB === undefined) return -1
      const confronto =
        typeof valoreA === 'number' && typeof valoreB === 'number'
          ? valoreA - valoreB
          : String(valoreA).localeCompare(String(valoreB), 'it')
      return direzione === 'asc' ? confronto : -confronto
    })
  }, [elementi, ordinamento])

  const pagine = Math.max(1, Math.ceil(ordinati.length / perPagina))
  const paginaCorrente = Math.min(pagina, pagine)
  const inizio = (paginaCorrente - 1) * perPagina
  const visibili = ordinati.slice(inizio, inizio + perPagina)

  /** Alterna asc/desc sul campo, o lo imposta come nuovo criterio. */
  function ordinaPer(campo: keyof T & string) {
    setOrdinamento((precedente) =>
      precedente?.campo === campo
        ? { campo, direzione: precedente.direzione === 'asc' ? 'desc' : 'asc' }
        : { campo, direzione: 'asc' },
    )
    setPagina(1)
  }

  return {
    visibili,
    totale: ordinati.length,
    pagina: paginaCorrente,
    pagine,
    perPagina,
    primoElemento: ordinati.length === 0 ? 0 : inizio + 1,
    ultimoElemento: Math.min(inizio + perPagina, ordinati.length),
    ordinamento,
    ordinaPer,
    vaiAPagina: (numero: number) => setPagina(Math.min(Math.max(1, numero), pagine)),
    cambiaPerPagina: (numero: number) => {
      setPerPagina(numero)
      setPagina(1)
    },
    azzeraPagina: () => setPagina(1),
  }
}
