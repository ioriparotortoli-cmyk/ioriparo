import { eNatale, stagioneDi } from '../lib/stagione'

/**
 * Dettaglio decorativo dell'apertura, diverso a ogni stagione.
 *
 * È disegnato (SVG) e animato in CSS: nessuna immagine da scaricare, quindi
 * non pesa sul caricamento. Sta dietro al contenuto, non intercetta i clic ed
 * è nascosto ai lettori di schermo — è decorazione, non informazione. Chi ha
 * chiesto animazioni ridotte lo vede fermo (regola in `sito.css`).
 *
 * Le posizioni sono scritte a mano invece che estratte a caso: così la scena
 * è sempre la stessa e resta bilanciata, senza grappoli o zone vuote.
 */

/** Elementi che cadono o salgono: sinistra in %, ritardo e durata in secondi. */
type Fluttuante = { x: number; ritardo: number; durata: number; scala: number }

const FOGLIE: Fluttuante[] = [
  { x: 8, ritardo: 0, durata: 19, scala: 1 },
  { x: 26, ritardo: -7, durata: 24, scala: 0.75 },
  { x: 47, ritardo: -13, durata: 21, scala: 0.9 },
  { x: 68, ritardo: -4, durata: 26, scala: 0.7 },
  { x: 84, ritardo: -17, durata: 22, scala: 1.05 },
]

const FIOCCHI: Fluttuante[] = [
  { x: 6, ritardo: 0, durata: 16, scala: 1 },
  { x: 15, ritardo: -9, durata: 21, scala: 0.6 },
  { x: 29, ritardo: -4, durata: 18, scala: 0.85 },
  { x: 41, ritardo: -14, durata: 23, scala: 0.7 },
  { x: 55, ritardo: -2, durata: 17, scala: 1 },
  { x: 67, ritardo: -11, durata: 20, scala: 0.65 },
  { x: 78, ritardo: -6, durata: 25, scala: 0.9 },
  { x: 91, ritardo: -16, durata: 19, scala: 0.75 },
]

const PETALI: Fluttuante[] = [
  { x: 10, ritardo: 0, durata: 23, scala: 0.9 },
  { x: 31, ritardo: -8, durata: 27, scala: 0.7 },
  { x: 52, ritardo: -15, durata: 21, scala: 1 },
  { x: 73, ritardo: -5, durata: 25, scala: 0.8 },
  { x: 89, ritardo: -19, durata: 29, scala: 0.65 },
]

const stile = (f: Fluttuante) => ({
  left: `${f.x}%`,
  animationDelay: `${f.ritardo}s`,
  animationDuration: `${f.durata}s`,
  transform: `scale(${f.scala})`,
})

/** Foglia stilizzata: una goccia con la nervatura centrale. */
const Foglia = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6 6 3 11 3 15a9 9 0 0 0 18 0c0-4-3-9-9-13Z" />
    <path d="M12 6v13" />
  </svg>
)

const Fiocco = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 2v20M3.4 7l17.2 10M20.6 7 3.4 17" />
  </svg>
)

const Petalo = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 3c5 3 7 7 5 11s-8 5-11 2-2-9 6-13Z" />
  </svg>
)

export function Stagione() {
  const stagione = stagioneDi()
  const natale = eNatale()

  if (stagione === 'estate') {
    return (
      <div className="stagione stagione--estate" aria-hidden="true">
        <svg className="stagione__sole" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="34" className="stagione__disco" />
          <g className="stagione__raggi">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="100" y1="46" x2="100" y2="24" transform={`rotate(${i * 30} 100 100)`} />
            ))}
          </g>
        </svg>

        {/* Il mare è il contesto di Tortolì: due onde appena accennate in fondo. */}
        <svg className="stagione__onde" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0 34c100 0 100-16 200-16s100 16 200 16 100-16 200-16 100 16 200 16 100-16 200-16 100 16 200 16" />
          <path
            className="stagione__onda2"
            d="M0 48c100 0 100-16 200-16s100 16 200 16 100-16 200-16 100 16 200 16 100-16 200-16 100 16 200 16"
          />
        </svg>
      </div>
    )
  }

  if (stagione === 'autunno') {
    return (
      <div className="stagione stagione--autunno" aria-hidden="true">
        {FOGLIE.map((f) => (
          <span className="stagione__cade" key={f.x} style={stile(f)}>
            <Foglia />
          </span>
        ))}
      </div>
    )
  }

  if (stagione === 'primavera') {
    return (
      <div className="stagione stagione--primavera" aria-hidden="true">
        {PETALI.map((p) => (
          <span className="stagione__sale" key={p.x} style={stile(p)}>
            <Petalo />
          </span>
        ))}
      </div>
    )
  }

  // Inverno: nevica sempre, e fra il 1º dicembre e il 6 gennaio si accendono
  // anche le luci. Passata l'Epifania restano solo i fiocchi.
  return (
    <div className="stagione stagione--inverno" aria-hidden="true">
      {natale && (
        <div className="stagione__luci">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" fill="none">
            <path d="M0 4c150 26 300 26 450 4s300-22 450 4 150 26 300 4" />
          </svg>
          {[6, 17, 28, 39, 50, 61, 72, 83, 94].map((x, i) => (
            <i key={x} style={{ left: `${x}%`, animationDelay: `${(i % 4) * 0.7}s` }} />
          ))}
        </div>
      )}

      {FIOCCHI.map((f) => (
        <span className="stagione__cade" key={f.x} style={stile(f)}>
          <Fiocco />
        </span>
      ))}
    </div>
  )
}
