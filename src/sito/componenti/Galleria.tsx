import { useCallback, useEffect, useState } from 'react'
import { CATEGORIE_GALLERIA, GALLERIA, type CategoriaGalleria, type VoceGalleria } from '../dati/contenuti'
import { cn } from '../lib/utili'
import { useEsc } from '../lib/hook'
import { Icona } from './Icona'
import { Illustrazione } from './Illustrazione'
import { Selettore } from './base'

function Riquadro({ voce, indice, onApri }: { voce: VoceGalleria; indice: number; onApri: (i: number) => void }) {
  return (
    <figure
      className={cn('gal__item', indice % 5 === 0 && 'gal__item--tall')}
      tabIndex={0}
      role="button"
      aria-label={`Apri: ${voce.titolo}`}
      onClick={() => onApri(indice)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onApri(indice)
        }
      }}
    >
      <Illustrazione scena={voce.scena} ritaglia />
      <figcaption className="gal__cap">
        <span>
          <b>{voce.titolo}</b>
          <span style={{ display: 'block' }}>{voce.descrizione}</span>
        </span>
        <Icona nome="plus" dimensione={18} />
      </figcaption>
    </figure>
  )
}

/**
 * Galleria con filtro per categoria e visualizzatore a schermo intero.
 * Nel visualizzatore si scorre con le frecce e si chiude con Esc.
 */
export function Galleria({ limite, filtrabile }: { limite?: number; filtrabile?: boolean }) {
  const [categoria, setCategoria] = useState<CategoriaGalleria | 'tutti'>('tutti')
  const [aperto, setAperto] = useState<number | null>(null)

  const elenco = (categoria === 'tutti' ? GALLERIA : GALLERIA.filter((g) => g.categoria === categoria)).slice(
    0,
    limite,
  )

  const scorri = useCallback(
    (passo: number) => setAperto((i) => (i === null ? i : (i + passo + elenco.length) % elenco.length)),
    [elenco.length],
  )

  useEsc(aperto !== null, () => setAperto(null))

  useEffect(() => {
    if (aperto === null) return
    document.body.style.overflow = 'hidden'
    const tasti = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') scorri(1)
      if (e.key === 'ArrowLeft') scorri(-1)
    }
    document.addEventListener('keydown', tasti)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', tasti)
    }
  }, [aperto, scorri])

  const voce = aperto === null ? null : elenco[aperto]

  return (
    <>
      {filtrabile && (
        <div style={{ marginBottom: 26 }}>
          <Selettore
            voci={CATEGORIE_GALLERIA}
            attiva={categoria}
            onCambia={(c) => {
              setCategoria(c)
              setAperto(null)
            }}
            etichetta="Filtra la galleria"
          />
        </div>
      )}

      <div className="gal">
        {elenco.map((g, i) => (
          <Riquadro key={g.titolo + i} voce={g} indice={i} onApri={setAperto} />
        ))}
      </div>

      <div
        className={cn('lb', voce && 'is-on')}
        role="dialog"
        aria-modal="true"
        aria-label="Immagine ingrandita"
        onClick={(e) => {
          if (e.target === e.currentTarget) setAperto(null)
        }}
      >
        {voce && (
          <div className="lb__box">
            <div style={{ position: 'relative' }}>
              <Illustrazione
                scena={voce.scena}
                ritaglia
                style={{ width: '100%', aspectRatio: '16 / 9', background: 'var(--panel-2)' }}
              />
              <div className="lb__nav">
                <button className="iconbtn" onClick={() => scorri(-1)} aria-label="Immagine precedente">
                  <Icona nome="left" />
                </button>
                <button className="iconbtn" onClick={() => scorri(1)} aria-label="Immagine successiva">
                  <Icona nome="right" />
                </button>
              </div>
            </div>
            <div className="lb__cap">
              <div>
                <b>{voce.titolo}</b>
                <div className="faint" style={{ fontSize: '.8rem' }}>
                  {voce.descrizione}
                </div>
              </div>
              <button className="iconbtn" onClick={() => setAperto(null)} aria-label="Chiudi">
                <Icona nome="x" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
