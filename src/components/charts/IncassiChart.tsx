import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PuntoIncasso } from '@/data/metriche'
import { formatEuro, formatEuroCompatto, formatData } from '@/lib/format'

/** Andamento degli incassi giornalieri con area sfumata. */
export function IncassiChart({ dati, altezza = 260 }: { dati: PuntoIncasso[]; altezza?: number }) {
  return (
    <div style={{ height: altezza }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dati} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="sfumaturaIncassi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1e2937" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="etichetta"
            tick={{ fill: '#6b7a92', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1e2937' }}
            interval="preserveStartEnd"
            minTickGap={12}
          />
          <YAxis
            tick={{ fill: '#6b7a92', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(valore: number) => formatEuroCompatto(valore)}
          />

          <Tooltip
            cursor={{ stroke: '#263349' }}
            contentStyle={{
              background: '#17202f',
              border: '1px solid #263349',
              borderRadius: 10,
              fontSize: 12,
              color: '#e8edf5',
            }}
            labelFormatter={(_etichetta, carico) =>
              formatData((carico?.[0]?.payload as PuntoIncasso | undefined)?.giorno)
            }
            formatter={(valore) => [formatEuro(Number(valore ?? 0)), 'Incasso']}
          />

          <Area
            type="monotone"
            dataKey="incasso"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#sfumaturaIncassi)"
            dot={{ r: 2.5, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#60a5fa', stroke: '#0a0e17', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
