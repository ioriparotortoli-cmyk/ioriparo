import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { VoceStato } from '@/data/metriche'

/**
 * Ciambella «Riparazioni per stato» con totale al centro
 * e legenda affiancata sulla destra.
 */
export function StatoDonut({
  voci,
  etichettaTotale = 'Totale',
  onSelezione,
}: {
  voci: VoceStato[]
  etichettaTotale?: string
  onSelezione?: (voce: VoceStato) => void
}) {
  const totale = voci.reduce((somma, voce) => somma + voce.valore, 0)
  const conValore = voci.filter((voce) => voce.valore > 0)

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative size-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={conValore.length ? conValore : [{ label: 'Nessun dato', valore: 1, colore: '#1e2937' }]}
              dataKey="valore"
              nameKey="label"
              innerRadius="66%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {(conValore.length ? conValore : [{ colore: '#1e2937' }]).map((voce, indice) => (
                <Cell
                  key={indice}
                  fill={voce.colore}
                  cursor={onSelezione ? 'pointer' : undefined}
                  onClick={() => conValore[indice] && onSelezione?.(conValore[indice])}
                />
              ))}
            </Pie>
            {conValore.length > 0 && (
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: '#17202f',
                  border: '1px solid #263349',
                  borderRadius: 10,
                  fontSize: 12,
                  color: '#e8edf5',
                }}
                formatter={(valore, nome) => [`${Number(valore ?? 0)} riparazioni`, String(nome)]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-ink-faint">{etichettaTotale}</span>
          <span className="text-3xl font-bold text-ink">{totale}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {voci.map((voce) => (
          <li key={voce.stato}>
            <button
              type="button"
              onClick={() => onSelezione?.(voce)}
              disabled={!onSelezione}
              className="flex w-full items-center gap-2.5 rounded-md px-1 py-0.5 text-left transition-colors enabled:hover:bg-surface-2"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: voce.colore }}
              />
              <span className="min-w-0 flex-1 text-[13px] leading-tight text-ink-muted">
                {voce.label}
              </span>
              <span className="text-[13px] font-semibold text-ink">{voce.valore}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
