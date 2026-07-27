import { useEffect, useRef, useState } from 'react'
import { RECENSIONI } from '../dati/contenuti'
import { animazioniRidotte } from '../lib/hook'
import { cn, iniziali } from '../lib/utili'
import { Icona } from './Icona'

const Stelle = () => (
  <div className="stars" aria-label="Valutazione 5 stelle su 5">
    {Array.from({ length: 5 }, (_, i) => (
      <Icona key={i} nome="star" dimensione={16} pieno />
    ))}
  </div>
)

/** Carosello delle recensioni: avanza da solo e si ferma al passaggio del mouse. */
export function Recensioni() {
  const [pagina, setPagina] = useState(0)
  const [perVista, setPerVista] = useState(1)
  const fermo = useRef(false)

  useEffect(() => {
    const misura = () => setPerVista(window.innerWidth >= 640 ? 2 : 1)
    misura()
    window.addEventListener('resize', misura)
    return () => window.removeEventListener('resize', misura)
  }, [])

  const pagine = Math.ceil(RECENSIONI.length / perVista)

  useEffect(() => {
    setPagina((p) => Math.min(p, pagine - 1))
  }, [pagine])

  useEffect(() => {
    if (animazioniRidotte()) return
    const timer = setInterval(() => {
      if (!fermo.current) setPagina((p) => (p + 1) % pagine)
    }, 5200)
    return () => clearInterval(timer)
  }, [pagine])

  return (
    <div
      className="revs reveal"
      onPointerEnter={() => (fermo.current = true)}
      onPointerLeave={() => (fermo.current = false)}
    >
      <div className="revs__track" style={{ transform: `translateX(-${pagina * 100}%)` }}>
        {RECENSIONI.map((r) => (
          <div className="rev" key={r.nome}>
            <div className="rev__card">
              <Stelle />
              <p className="rev__txt">“{r.testo}”</p>
              <div className="rev__who">
                <span
                  className="avatar"
                  style={{ background: `linear-gradient(140deg, ${r.colore}, color-mix(in srgb, ${r.colore} 55%, #7fb2ff))` }}
                  aria-hidden="true"
                >
                  {iniziali(r.nome)}
                </span>
                <span>
                  <b>{r.nome}</b>
                  <span>{r.ruolo}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="revs__nav">
        <div className="dots">
          {Array.from({ length: pagine }, (_, i) => (
            <button
              key={i}
              className={cn(i === pagina && 'is-on')}
              onClick={() => setPagina(i)}
              aria-label={`Pagina ${i + 1} delle recensioni`}
              aria-current={i === pagina}
            />
          ))}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button
            className="iconbtn"
            onClick={() => setPagina((p) => (p - 1 + pagine) % pagine)}
            aria-label="Recensione precedente"
          >
            <Icona nome="left" />
          </button>
          <button className="iconbtn" onClick={() => setPagina((p) => (p + 1) % pagine)} aria-label="Recensione successiva">
            <Icona nome="right" />
          </button>
        </div>
      </div>
    </div>
  )
}
