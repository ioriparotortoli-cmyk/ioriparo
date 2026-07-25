import { cn } from '@/lib/cn'

/** Marchio IO RIPARO: smartphone stilizzato con chiave inglese. */
export function Logo({
  compatto,
  className,
}: {
  compatto?: boolean
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 40 40"
        className={cn('shrink-0', compatto ? 'size-8' : 'size-10')}
        role="img"
        aria-label="IO RIPARO"
      >
        <rect width="40" height="40" rx="10" fill="#0f1826" stroke="#233045" />
        <rect x="10" y="6" width="17" height="28" rx="3.5" fill="#2563eb" />
        <rect x="12.4" y="9.5" width="12.2" height="18.5" rx="1.6" fill="#0a0e17" />
        <circle cx="18.5" cy="31" r="1.5" fill="#0a0e17" />
        <path
          d="M25 14.5l4.2-4.2a4.3 4.3 0 015.8 5.8l-4.2 4.2"
          stroke="#60a5fa"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="31.5" cy="12.5" r="1.6" fill="#93c5fd" />
      </svg>

      {!compatto && (
        <span className="min-w-0">
          <span className="block text-[17px] leading-none font-extrabold tracking-tight text-white">
            IO RIPARO
          </span>
          <span className="mt-1 block text-[8px] font-semibold tracking-[0.18em] text-ink-faint uppercase">
            Assistenza e Riparazioni
          </span>
        </span>
      )}
    </span>
  )
}
