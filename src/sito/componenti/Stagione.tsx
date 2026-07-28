import { stagioneDi } from '../lib/stagione'

/**
 * Dettaglio decorativo dell'apertura, diverso a ogni stagione.
 *
 * È disegnato (SVG) e animato in CSS: nessuna immagine da scaricare, quindi
 * non pesa sul caricamento. Sta dietro al contenuto, non intercetta i clic ed
 * è nascosto ai lettori di schermo — è decorazione, non informazione. Chi ha
 * chiesto animazioni ridotte lo vede fermo (regola in `sito.css`).
 */
export function Stagione() {
  const stagione = stagioneDi()

  // Per ora è disegnata l'estate; le altre arrivano una alla volta.
  if (stagione !== 'estate') return null

  return (
    <div className="stagione stagione--estate" aria-hidden="true">
      <svg className="stagione__sole" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="34" className="stagione__disco" />
        <g className="stagione__raggi">
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1="100"
              y1="46"
              x2="100"
              y2="24"
              transform={`rotate(${i * 30} 100 100)`}
            />
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
