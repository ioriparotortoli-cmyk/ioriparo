import { Link } from 'react-router-dom'
import type { Articolo } from '../dati/blog'
import { Icona } from './Icona'
import { Illustrazione } from './Illustrazione'

/** Riquadro di anteprima di un articolo, usato in home, blog e pagina articolo. */
export function AnteprimaArticolo({ articolo }: { articolo: Articolo }) {
  return (
    <Link className="post" to={`/blog/${articolo.slug}`}>
      <div className="post__art">
        <Illustrazione scena={articolo.scena} ritaglia />
      </div>
      <div className="post__body">
        <div className="post__meta">
          <span style={{ color: 'var(--blue-glow)' }}>{articolo.categoria}</span>
          <span>·</span>
          <span>{articolo.data}</span>
          <span>·</span>
          <span>{articolo.lettura}</span>
        </div>
        <h3>{articolo.titolo}</h3>
        <p>{articolo.sommario}</p>
        <span className="link" style={{ marginTop: 'auto', fontSize: '.85rem' }}>
          Leggi l’articolo <Icona nome="arrow" dimensione={15} />
        </span>
      </div>
    </Link>
  )
}
