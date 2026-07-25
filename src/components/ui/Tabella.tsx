import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Select } from './Form'

export function Tabella({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full min-w-[820px] border-collapse text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TabellaHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-line text-left">{children}</tr>
    </thead>
  )
}

export function Th({
  children,
  className,
  allineamento = 'left',
}: {
  children: ReactNode
  className?: string
  allineamento?: 'left' | 'right' | 'center'
}) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-[10px] font-bold tracking-wider text-ink-faint uppercase',
        allineamento === 'right' && 'text-right',
        allineamento === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function Tr({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </tr>
  )
}

export function Td({
  children,
  className,
  allineamento = 'left',
}: {
  children: ReactNode
  className?: string
  allineamento?: 'left' | 'right' | 'center'
}) {
  return (
    <td
      className={cn(
        'px-4 py-3 align-middle text-ink-muted',
        allineamento === 'right' && 'text-right',
        allineamento === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </td>
  )
}

export function StatoVuoto({
  titolo,
  descrizione,
  azione,
}: {
  titolo: string
  descrizione?: string
  azione?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
        <Inbox size={22} />
      </span>
      <p className="text-sm font-medium text-ink">{titolo}</p>
      {descrizione && <p className="max-w-sm text-xs text-ink-faint">{descrizione}</p>}
      {azione && <div className="mt-2">{azione}</div>}
    </div>
  )
}

/** Barra di paginazione con conteggio e scelta della dimensione pagina. */
export function Paginazione({
  pagina,
  pagine,
  totale,
  primoElemento,
  ultimoElemento,
  perPagina,
  etichettaElementi = 'elementi',
  onCambiaPagina,
  onCambiaPerPagina,
}: {
  pagina: number
  pagine: number
  totale: number
  primoElemento: number
  ultimoElemento: number
  perPagina?: number
  etichettaElementi?: string
  onCambiaPagina: (pagina: number) => void
  onCambiaPerPagina?: (perPagina: number) => void
}) {
  const numeri = numeriPagina(pagina, pagine)

  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-ink-faint">
        {totale === 0
          ? `Nessun elemento`
          : `Vista da ${primoElemento} a ${ultimoElemento} di ${totale} ${etichettaElementi}`}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCambiaPagina(pagina - 1)}
          disabled={pagina <= 1}
          aria-label="Pagina precedente"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-line-soft bg-surface-2 text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {numeri.map((numero, indice) =>
          numero === '…' ? (
            <span key={`gap-${indice}`} className="px-1 text-xs text-ink-faint">
              …
            </span>
          ) : (
            <button
              key={numero}
              type="button"
              onClick={() => onCambiaPagina(numero)}
              aria-current={numero === pagina ? 'page' : undefined}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors',
                numero === pagina
                  ? 'border-transparent bg-brand text-white'
                  : 'border-line-soft bg-surface-2 text-ink-muted hover:text-ink',
              )}
            >
              {numero}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onCambiaPagina(pagina + 1)}
          disabled={pagina >= pagine}
          aria-label="Pagina successiva"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-line-soft bg-surface-2 text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>

        {onCambiaPerPagina && perPagina !== undefined && (
          <Select
            value={perPagina}
            onChange={(e) => onCambiaPerPagina(Number(e.target.value))}
            aria-label="Elementi per pagina"
            className="ml-1 h-8 w-32 text-xs"
          >
            {[8, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} / pagina
              </option>
            ))}
          </Select>
        )}
      </div>
    </div>
  )
}

/** Sequenza compatta di numeri di pagina con ellissi. */
function numeriPagina(corrente: number, totale: number): Array<number | '…'> {
  if (totale <= 5) return Array.from({ length: totale }, (_, i) => i + 1)
  if (corrente <= 3) return [1, 2, 3, '…', totale]
  if (corrente >= totale - 2) return [1, '…', totale - 2, totale - 1, totale]
  return [1, '…', corrente, '…', totale]
}
