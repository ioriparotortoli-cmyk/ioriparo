import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface VoceBriciola {
  label: string
  to?: string
}

/** Titolo di pagina con eventuali briciole di pane e azioni sulla destra. */
export function PageHeader({
  titolo,
  sottotitolo,
  briciole,
  azioni,
}: {
  titolo: string
  sottotitolo?: string
  briciole?: VoceBriciola[]
  azioni?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-ink">{titolo}</h1>
        {briciole ? (
          <nav aria-label="Percorso" className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
            {briciole.map((voce, indice) => (
              <span key={voce.label} className="flex items-center gap-1">
                {indice > 0 && <ChevronRight size={12} />}
                {voce.to ? (
                  <Link to={voce.to} className="transition-colors hover:text-ink-muted">
                    {voce.label}
                  </Link>
                ) : (
                  <span className="text-ink-muted">{voce.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          sottotitolo && <p className="mt-1 text-xs text-ink-faint">{sottotitolo}</p>
        )}
      </div>
      {azioni && <div className="flex flex-wrap items-center gap-2">{azioni}</div>}
    </div>
  )
}
