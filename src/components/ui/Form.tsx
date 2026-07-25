import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'

const CAMPO_BASE = 'ui-field'

export function Campo({
  etichetta,
  obbligatorio,
  aiuto,
  errore,
  children,
  className,
}: {
  etichetta?: string
  obbligatorio?: boolean
  aiuto?: ReactNode
  errore?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      {etichetta && (
        <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-ink-muted">
          {etichetta}
          {obbligatorio && <span className="text-rose-400">*</span>}
        </span>
      )}
      {children}
      {errore ? (
        <span className="mt-1 block text-xs text-rose-400">{errore}</span>
      ) : (
        aiuto && <span className="mt-1 block text-xs text-ink-faint">{aiuto}</span>
      )}
    </label>
  )
}

export function Input({
  className,
  iconaDestra,
  ...resto
}: InputHTMLAttributes<HTMLInputElement> & { iconaDestra?: ReactNode }) {
  if (iconaDestra) {
    return (
      <span className="relative block">
        <input className={cn(CAMPO_BASE, 'h-10 pr-10', className)} {...resto} />
        <span className="absolute inset-y-0 right-3 flex items-center text-ink-faint">
          {iconaDestra}
        </span>
      </span>
    )
  }
  return <input className={cn(CAMPO_BASE, 'h-10', className)} {...resto} />
}

/**
 * Campo data che mostra un'etichetta finché è vuoto: il segnaposto nativo
 * di `input[type=date]` dipende dalla lingua del browser e non è modificabile.
 */
export function InputData({
  value,
  onChange,
  placeholder,
  className,
  ...resto
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { placeholder?: string }) {
  const [attivo, setAttivo] = useState(false)
  const comeData = attivo || Boolean(value)

  return (
    <input
      type={comeData ? 'date' : 'text'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setAttivo(true)}
      onBlur={() => setAttivo(false)}
      className={cn(CAMPO_BASE, 'h-10', className)}
      {...resto}
    />
  )
}

export function Select({
  className,
  children,
  ...resto
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        CAMPO_BASE,
        'h-10 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' stroke=\'%2393a1b8\' stroke-width=\'2\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9',
        className,
      )}
      {...resto}
    >
      {children}
    </select>
  )
}

export function Textarea({
  className,
  ...resto
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CAMPO_BASE, 'min-h-24 py-2.5 leading-relaxed', className)} {...resto} />
}

export function Checkbox({
  etichetta,
  className,
  ...resto
}: InputHTMLAttributes<HTMLInputElement> & { etichetta: string }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2 text-sm text-ink-muted', className)}>
      <input type="checkbox" className="ui-check" {...resto} />
      <span>{etichetta}</span>
    </label>
  )
}

export function Radio({
  etichetta,
  className,
  ...resto
}: InputHTMLAttributes<HTMLInputElement> & { etichetta: string }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2 text-sm text-ink-muted', className)}>
      <input type="radio" className="ui-radio" {...resto} />
      <span>{etichetta}</span>
    </label>
  )
}

/** Gruppo di pulsanti mutuamente esclusivi (es. condizioni esterne). */
export function GruppoSegmenti<T extends string>({
  valore,
  opzioni,
  onChange,
  className,
}: {
  valore: T | undefined
  opzioni: Array<{ valore: T; label: string; classeAttiva?: string }>
  onChange: (valore: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {opzioni.map((opzione) => {
        const attivo = valore === opzione.valore
        return (
          <button
            key={opzione.valore}
            type="button"
            onClick={() => onChange(opzione.valore)}
            aria-pressed={attivo}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              attivo
                ? (opzione.classeAttiva ?? 'border-brand bg-brand text-white')
                : 'border-line-soft bg-surface-2 text-ink-muted hover:text-ink',
            )}
          >
            {opzione.label}
          </button>
        )
      })}
    </div>
  )
}

/** Intestazione di sezione dei form dell'accettazione. */
export function SezioneForm({
  titolo,
  azione,
  children,
  className,
}: {
  titolo: string
  azione?: ReactNode
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className={cn('rounded-card border border-line bg-surface', className)}
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h3
          id={id}
          className="text-[11px] font-bold tracking-wider text-ink-muted uppercase"
        >
          {titolo}
        </h3>
        {azione}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}
